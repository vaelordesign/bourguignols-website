/* ============================================================
   LES BOURGUIGNOLS : la liaison avec la base en ligne (Supabase).
   Écrit à la main, sans bibliothèque : rien à mettre à jour, rien
   qui puisse disparaître d'un serveur tiers.

   Trois usages :
   1. Le site public LIT les données (personne n'a besoin de compte).
   2. Le module de gestion ÉCRIT, une fois la personne connectée.
   3. Les photos et les PDF partent dans l'entrepôt de fichiers.

   Si la base ne répond pas, le site retombe sur le fichier
   js/domaines-data.js livré avec lui : il n'est jamais vide.
   ============================================================ */
(function (root) {
  'use strict';

  var C = root.LB_CONFIG || {};
  var CLE_SESSION = 'lb_session_v1';

  function url(chemin) { return C.url + chemin; }

  function entetes(avecJeton, extra) {
    var h = { apikey: C.cle };
    if (extra) for (var k in extra) if (Object.prototype.hasOwnProperty.call(extra, k)) h[k] = extra[k];
    var s = session();
    h.Authorization = 'Bearer ' + (avecJeton && s ? s.access_token : C.cle);
    return h;
  }

  /* ---------- La session (qui est connecté) ---------- */
  function session() {
    try {
      var brut = localStorage.getItem(CLE_SESSION);
      if (!brut) return null;
      var s = JSON.parse(brut);
      return (s && s.access_token) ? s : null;
    } catch (e) { return null; }
  }

  function poserSession(s) {
    try {
      if (s) localStorage.setItem(CLE_SESSION, JSON.stringify(s));
      else localStorage.removeItem(CLE_SESSION);
    } catch (e) { /* navigation privée : la session ne survit pas à l'onglet */ }
  }

  function expiree() {
    var s = session();
    return !s || !s.expires_at || (s.expires_at * 1000 - 60000) < Date.now();
  }

  function connexion(courrielSaisi, motDePasse) {
    return fetch(url('/auth/v1/token?grant_type=password'), {
      method: 'POST',
      headers: { apikey: C.cle, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: String(courrielSaisi || '').trim(), password: motDePasse || '' })
    }).then(function (r) {
      return r.json().then(function (j) {
        if (!r.ok) {
          var m = (j && (j.error_description || j.msg || j.message)) || '';
          if (/invalid login/i.test(m)) m = 'Courriel ou mot de passe incorrect.';
          else if (/email not confirmed/i.test(m)) m = 'Ce compte n’est pas encore activé.';
          else if (!m) m = 'Connexion impossible pour le moment.';
          throw new Error(m);
        }
        poserSession(j);
        return j.user;
      });
    });
  }

  function rafraichir() {
    var s = session();
    if (!s || !s.refresh_token) return Promise.reject(new Error('Aucune session'));
    return fetch(url('/auth/v1/token?grant_type=refresh_token'), {
      method: 'POST',
      headers: { apikey: C.cle, 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: s.refresh_token })
    }).then(function (r) {
      if (!r.ok) { poserSession(null); throw new Error('Session expirée'); }
      return r.json().then(function (j) { poserSession(j); return j; });
    });
  }

  function pret() {                       /* à appeler avant toute écriture */
    return expiree() ? rafraichir() : Promise.resolve(session());
  }

  function deconnexion() {
    var s = session();
    poserSession(null);
    if (!s) return Promise.resolve();
    return fetch(url('/auth/v1/logout'), {
      method: 'POST',
      headers: { apikey: C.cle, Authorization: 'Bearer ' + s.access_token }
    }).catch(function () { /* déjà parti */ });
  }

  function courriel() { var s = session(); return (s && s.user) ? s.user.email : ''; }

  /* ---------- Lire (tout le monde) ---------- */
  function lire() {
    return fetch(url('/rest/v1/sites?id=eq.' + encodeURIComponent(C.site) + '&select=donnees,maj_le'), {
      headers: { apikey: C.cle, Authorization: 'Bearer ' + C.cle, Accept: 'application/json' },
      cache: 'no-store'
    }).then(function (r) {
      if (!r.ok) throw new Error('Lecture impossible (' + r.status + ')');
      return r.json();
    }).then(function (rows) {
      if (!rows || !rows.length) throw new Error('Site absent de la base');
      var d = rows[0].donnees;
      if (!d || !Array.isArray(d.domaines)) throw new Error('Données inutilisables');
      d.maj_le = rows[0].maj_le;
      return d;
    });
  }

  /* ---------- Écrire (personne connectée seulement) ---------- */
  function ecrire(donnees) {
    return pret().then(function () {
      return fetch(url('/rest/v1/sites?id=eq.' + encodeURIComponent(C.site)), {
        method: 'PATCH',
        headers: entetes(true, { 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
        body: JSON.stringify({ donnees: donnees, maj_par: courriel() })
      });
    }).then(function (r) {
      if (r.status === 401 || r.status === 403) {
        throw new Error('Votre session a expiré, ou ce compte n’a pas le droit de modifier ce site.');
      }
      if (!r.ok) {
        return r.text().then(function (t) { throw new Error('Enregistrement refusé : ' + t.slice(0, 160)); });
      }
      oublierCopie();   // pour voir son changement tout de suite en allant sur le site
      return true;
    });
  }

  /* ---------- Les photos et les PDF ---------- */
  function televerser(fichier, sousChemin) {
    var chemin = C.site + '/' + sousChemin;
    return pret().then(function () {
      return fetch(url('/storage/v1/object/sites/' + chemin), {
        method: 'POST',
        headers: entetes(true, { 'Content-Type': fichier.type || 'application/octet-stream', 'x-upsert': 'true' }),
        body: fichier
      });
    }).then(function (r) {
      if (!r.ok) {
        return r.text().then(function (t) { throw new Error('Envoi du fichier refusé : ' + t.slice(0, 160)); });
      }
      return url('/storage/v1/object/public/sites/' + chemin);
    });
  }

  /* ---------- Historique (rétablir une version précédente) ---------- */
  function versions() {
    return pret().then(function () {
      return fetch(url('/rest/v1/site_versions?site_id=eq.' + encodeURIComponent(C.site) +
        '&select=id,cree_le,cree_par&order=cree_le.desc&limit=30'), { headers: entetes(true) });
    }).then(function (r) { return r.ok ? r.json() : []; });
  }

  function version(id) {
    return pret().then(function () {
      return fetch(url('/rest/v1/site_versions?id=eq.' + id + '&select=donnees'), { headers: entetes(true) });
    }).then(function (r) { return r.json(); })
      .then(function (rows) { return rows[0] && rows[0].donnees; });
  }

  /* ---------- Copie locale, pour ne pas faire attendre le visiteur ----------
     La base répond en 300 ms environ : c'est peu, mais c'est 300 ms d'écran
     figé à chaque page. On garde donc une copie dans le navigateur du visiteur.
     Première visite : on attend la base. Ensuite : affichage immédiat, et la
     base est relue en arrière-plan pour la fois suivante.
     Le module de gestion efface cette copie après chaque publication, pour que
     l'agence voie son changement tout de suite sur son propre écran. */
  var CLE_COPIE = 'lb_copie_v1';
  var FRAICHEUR = 10 * 60 * 1000;   // 10 minutes

  function copieLocale() {
    try {
      var brut = localStorage.getItem(CLE_COPIE);
      if (!brut) return null;
      var c = JSON.parse(brut);
      if (!c || !c.le || !c.donnees || !Array.isArray(c.donnees.domaines)) return null;
      if (Date.now() - c.le > FRAICHEUR) return null;
      return c.donnees;
    } catch (e) { return null; }
  }
  function poserCopie(d) {
    try { localStorage.setItem(CLE_COPIE, JSON.stringify({ le: Date.now(), donnees: d })); }
    catch (e) { /* stockage plein ou refusé : tant pis, on relira la base */ }
  }
  function oublierCopie() {
    try { localStorage.removeItem(CLE_COPIE); } catch (e) { /* rien */ }
  }

  /* ---------- Le rendu du site public ----------
     On tente la base ; passé le délai (ou en cas de panne), on garde le
     fichier livré avec le site. Puis on charge les scripts de rendu. */
  function avantRendu(scripts) {
    var liste = [].concat(scripts || []);
    var fini = false;

    function suite() {
      if (fini) return;
      fini = true;
      (function suivant(i) {
        if (i >= liste.length) return;
        var s = document.createElement('script');
        s.src = liste[i];
        s.onload = function () { suivant(i + 1); };
        s.onerror = function () { suivant(i + 1); };
        document.body.appendChild(s);
      })(0);
    }

    var copie = copieLocale();
    if (copie) {                       // affichage immédiat
      root.LB_DATA = copie;
      root.LB_SOURCE = 'copie';
      suite();
      lire().then(poserCopie).catch(function () { /* on garde la copie */ });
      return;
    }

    var minuterie = setTimeout(suite, C.attenteMax || 1500);
    lire().then(function (d) {
      root.LB_DATA = d;
      root.LB_SOURCE = 'base';
      poserCopie(d);
    }).catch(function () {
      root.LB_SOURCE = 'fichier';
    }).then(function () {
      clearTimeout(minuterie);
      suite();
    });
  }

  root.LB_NUAGE = {
    connexion: connexion, deconnexion: deconnexion, session: session, courriel: courriel,
    rafraichir: rafraichir, pret: pret, lire: lire, ecrire: ecrire, televerser: televerser,
    versions: versions, version: version, avantRendu: avantRendu, oublierCopie: oublierCopie
  };
})(window);
