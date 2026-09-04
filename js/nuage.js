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

  /* ---------- La session (qui est connecté) ----------
     Certains navigateurs refusent le stockage : navigation privée, protection
     anti-pistage, cookies bloqués pour le site. Sans filet, la connexion
     réussissait côté serveur mais la session disparaissait aussitôt : la page
     revenait à l'écran de connexion sans rien expliquer, et on croyait que le
     mot de passe était faux. On descend donc les marches une à une :
     localStorage → sessionStorage → mémoire de l'onglet. */
  var sessionMemoire = null;
  var niveauStockage = null;      // 'durable' | 'onglet' | 'memoire'

  function essais() {
    var l = [];
    try { if (window.localStorage) l.push({ nom: 'durable', magasin: localStorage }); } catch (e) { /* refusé */ }
    try { if (window.sessionStorage) l.push({ nom: 'onglet', magasin: sessionStorage }); } catch (e) { /* refusé */ }
    return l;
  }

  function session() {
    if (sessionMemoire) return sessionMemoire;
    var l = essais();
    for (var i = 0; i < l.length; i++) {
      try {
        var brut = l[i].magasin.getItem(CLE_SESSION);
        if (!brut) continue;
        var s = JSON.parse(brut);
        if (s && s.access_token) { sessionMemoire = s; return s; }
      } catch (e) { /* on essaie le suivant */ }
    }
    return null;
  }

  function poserSession(s) {
    sessionMemoire = s || null;
    niveauStockage = 'memoire';
    var l = essais();
    for (var i = 0; i < l.length; i++) {
      try {
        if (s) l[i].magasin.setItem(CLE_SESSION, JSON.stringify(s));
        else l[i].magasin.removeItem(CLE_SESSION);
        if (niveauStockage === 'memoire') niveauStockage = l[i].nom;
      } catch (e) { /* magasin refusé : on continue */ }
    }
  }

  /* Dit où la session a pu être gardée, pour prévenir la personne quand elle
     ne survivra pas au changement de page. */
  function stockage() { return niveauStockage || (session() ? 'durable' : null); }

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
  function charger(src) {
    return new Promise(function (ok) {
      var s = document.createElement('script');
      s.src = src;
      s.onload = ok; s.onerror = ok;
      document.body.appendChild(s);
    });
  }
  function chargerCss(href) {
    var l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = href;
    document.head.appendChild(l);
  }
  function base() {
    /* les pages de domaine sont deux dossiers plus bas */
    return (document.body.getAttribute('data-base') || '');
  }

  /* Les retouches faites par le client dans l'éditeur visuel, puis
     l'éditeur lui-même si l'adresse se termine par ?edition. */
  function apresRendu() {
    var d = root.LB_DATA || {};
    var contenu = d.contenu;
    var edition = /[?&]edition\b/.test(location.search);
    var b = base();
    var suite = Promise.resolve();

    var page = contenu && contenu.pages ? (contenu.pages[/\/domaines\//.test(location.pathname) ? 'domaine' : (location.pathname.split('/').pop() || 'index.html')] || {}) : {};
    var aDesBlocs = (page.ajouts || []).length > 0;

    if (contenu || edition) suite = suite.then(function () { return charger(b + 'editeur/vaelor-contenu.js'); });
    if (aDesBlocs || edition) {
      chargerCss(b + 'editeur/vaelor-blocs.css');
      suite = suite.then(function () { return charger(b + 'editeur/vaelor-blocs.js'); });
    }
    suite = suite.then(function () {
      if (root.VAELOR_CONTENU && contenu && !edition) root.VAELOR_CONTENU.appliquer(contenu);
    });
    if (edition) {
      var noindex = document.createElement('meta');   // jamais dans Google en mode édition
      noindex.name = 'robots'; noindex.content = 'noindex, nofollow';
      document.head.appendChild(noindex);
      chargerCss(b + 'editeur/vaelor-editeur.css');
      suite = suite.then(function () { return charger(b + 'editeur/vaelor-editeur.js'); });
    } else {
      suite = suite.then(pastille);
    }
    return suite;
  }

  /* La pastille du propriétaire : elle n'apparaît QUE pour une personne
     connectée. Un visiteur ordinaire ne la voit jamais et ne sait même pas
     qu'un panneau de contrôle existe. C'est l'équivalent de la barre noire
     de WordPress, en beaucoup plus discret. */
  function pastille() {
    if (!session() || document.getElementById('lb-pastille')) return;
    var b = base();
    var d = document.createElement('div');
    d.id = 'lb-pastille';
    d.innerHTML =
      '<a href="' + b + 'gestion.html">Panneau</a>' +
      '<a href="' + location.pathname + '?edition">Modifier cette page</a>' +
      '<button type="button" title="Masquer jusqu’à la prochaine visite">×</button>';
    d.setAttribute('style', [
      'position:fixed', 'right:14px', 'bottom:14px', 'z-index:9998', 'display:flex',
      'align-items:center', 'gap:2px', 'padding:4px', 'border-radius:9px',
      'background:#17161a', 'box-shadow:0 6px 22px rgba(0,0,0,.28)',
      'font:600 12px/1 system-ui,-apple-system,"Segoe UI",sans-serif'
    ].join(';'));
    [].forEach.call(d.children, function (n) {
      n.setAttribute('style', [
        'color:#f2f0ec', 'text-decoration:none', 'padding:8px 11px', 'border-radius:6px',
        'background:none', 'border:0', 'cursor:pointer', 'font:inherit', 'white-space:nowrap'
      ].join(';'));
      n.addEventListener('mouseenter', function () { n.style.background = 'rgba(255,255,255,.14)'; });
      n.addEventListener('mouseleave', function () { n.style.background = 'none'; });
    });
    d.lastElementChild.addEventListener('click', function () {
      d.remove();
      try { sessionStorage.setItem('lb_pastille_off', '1'); } catch (e) { /* rien */ }
    });
    try { if (sessionStorage.getItem('lb_pastille_off')) return; } catch (e) { /* rien */ }
    document.body.appendChild(d);

    /* On la remonte si un bandeau occupe déjà le bas de l'écran. */
    function placer() {
      var bas = 14;
      [].forEach.call(document.querySelectorAll('body > *'), function (n) {
        if (n === d) return;
        var st = getComputedStyle(n);
        /* attention : offsetParent est nul sur un élément fixe, on ne peut pas
           s'en servir pour savoir s'il est affiché */
        if (st.position !== 'fixed' || st.display === 'none' || st.visibility === 'hidden') return;
        var r = n.getBoundingClientRect();
        if (!r.height) return;
        if (r.bottom >= innerHeight - 2 && r.height < innerHeight / 2 && r.width > innerWidth / 2) {
          bas = Math.max(bas, Math.round(r.height) + 12);
        }
      });
      d.style.bottom = bas + 'px';
    }
    placer();
    addEventListener('resize', placer);
    setTimeout(placer, 600);   // le temps que les bandeaux se posent
  }

  function avantRendu(scripts) {
    var liste = [].concat(scripts || []);
    var fini = false;

    function suite() {
      if (fini) return;
      fini = true;
      (function suivant(i) {
        if (i >= liste.length) { apresRendu(); return; }
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
    versions: versions, version: version, avantRendu: avantRendu, oublierCopie: oublierCopie,
    stockage: stockage
  };
})(window);
