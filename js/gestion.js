/* ============================================================
   LES BOURGUIGNOLS : module de gestion (démonstration)
   Onglet Domaines : ajouter, modifier, retirer des domaines et leurs cuvées.
   Onglet Arrivages : le bloc « Prochain arrivage » de l'accueil.
   Les changements sont gardés dans le navigateur (localStorage) et lus
   par toutes les pages du site. « Exporter » produit le fichier
   domaines-data.js à remettre dans le dossier js/ (puis node build-pages.js).
   ============================================================ */
(function () {
  'use strict';

  var STORAGE_KEY = 'lb_domaines_v1';
  var COULEURS = ['rouge', 'blanc', 'rosé', 'effervescent'];
  var $ = function (id) { return document.getElementById(id); };
  var F = window.LB_FICHE;
  var esc = F.esc, pad = F.pad;
  var slug = function (s) { return F.slug(String(s || '').replace(/^domaine\s+/i, '')) || 'domaine'; };

  /* ---------- Données ---------- */
  function copie(o) { return JSON.parse(JSON.stringify(o)); }
  function charger() {
    var base = copie(window.LB_DATA || { regions: [], domaines: [], arrivages: [] });
    base.arrivages = base.arrivages || [];
    try {
      var brut = localStorage.getItem(STORAGE_KEY);
      if (brut) {
        var perso = JSON.parse(brut);
        if (perso && Array.isArray(perso.domaines)) return { regions: perso.regions || base.regions, domaines: perso.domaines, arrivages: perso.arrivages || [] };
      }
    } catch (e) { /* on garde la base */ }
    return base;
  }

  var DATA = charger();
  var mode = 'domaines';   // 'domaines' | 'arrivages'
  var courant = null;      // domaine en cours d'édition
  var arrCourant = null;   // arrivage en cours d'édition
  var sale = false;
  var filtre = '';

  function renumeroter() {
    DATA.domaines.sort(function (a, b) { return (a.ordre || 0) - (b.ordre || 0); });
    DATA.domaines.forEach(function (d, i) { d.ordre = i + 1; });
  }
  function marquer(dirty) {
    sale = dirty;
    var s = $('lg-status');
    s.textContent = dirty ? 'Modifications non enregistrées' : 'Tout est enregistré';
    s.classList.toggle('is-dirty', dirty);
  }
  function enregistrer() {
    renumeroter();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DATA));
      marquer(false);
      toast('Enregistré. Le site affiche maintenant vos changements.');
    } catch (e) {
      toast('Impossible d’enregistrer : le navigateur refuse (photos trop lourdes ou stockage désactivé).');
    }
    rendreListe();
  }
  function toast(msg) {
    var t = $('lg-toast');
    t.textContent = msg; t.hidden = false;
    clearTimeout(toast.timer);
    toast.timer = setTimeout(function () { t.hidden = true; }, 3200);
  }
  function domaineUrl(d) {
    return new URL(F.pageUrl(d, '', window.LB_DATA), location.href).href;
  }

  /* ---------- Liste (selon l'onglet) ---------- */
  function rendreListe() {
    var q = filtre.toLowerCase();
    var html;
    if (mode === 'domaines') {
      renumeroter();
      html = DATA.domaines.filter(function (d) {
        return !q || (d.nom + ' ' + d.village + ' ' + d.region).toLowerCase().indexOf(q) !== -1;
      }).map(function (d) {
        return '<li class="lg-item' + (courant && courant.id === d.id ? ' is-active' : '') + '" data-id="' + esc(d.id) + '">' +
          '<span class="lg-item__n">' + pad(d.ordre) + '</span>' +
          '<span><span class="lg-item__name">' + esc(d.nom || 'Sans nom') + '</span><br><span class="lg-item__where">' + esc(d.village || '') + (d.region ? ' · ' + esc(d.region) : '') + '</span></span>' +
          (d.visible === false ? '<span class="lg-item__badge">Masqué</span>' : '<span class="lg-item__badge" style="border-color:transparent">' + (d.vins || []).length + ' cuv.</span>') +
          '</li>';
      }).join('') || '<li class="lg-wines__empty" style="padding:14px">Aucun domaine.</li>';
    } else {
      var tri = DATA.arrivages.slice().sort(function (a, b) { return String(b.date || '').localeCompare(String(a.date || '')); });
      html = tri.filter(function (a) {
        return !q || (a.titre + ' ' + (a.dateTexte || '')).toLowerCase().indexOf(q) !== -1;
      }).map(function (a) {
        var badge = a.statut === 'a-venir' ? '<span class="lg-item__badge lg-item__badge--avenir">À venir</span>' : a.statut === 'brouillon' ? '<span class="lg-item__badge">Brouillon</span>' : '<span class="lg-item__badge">Arrivé</span>';
        return '<li class="lg-item' + (arrCourant && arrCourant.id === a.id ? ' is-active' : '') + '" data-arr="' + esc(a.id) + '">' +
          '<span class="lg-item__n">' + (a.lignes || []).length + '</span>' +
          '<span><span class="lg-item__name">' + esc(a.titre || 'Sans titre') + '</span><br><span class="lg-item__where">' + esc(a.dateTexte || a.date || '') + (a.visible === false ? ' · masqué' : '') + '</span></span>' + badge + '</li>';
      }).join('') || '<li class="lg-wines__empty" style="padding:14px">Aucun arrivage. Ajoutez-en un.</li>';
    }
    $('lg-items').innerHTML = html;
  }

  function changerMode(m) {
    mode = m;
    document.querySelectorAll('.lg-mode button').forEach(function (b) { b.classList.toggle('is-active', b.getAttribute('data-mode') === m); });
    $('lg-add').textContent = m === 'domaines' ? '+ Ajouter un domaine' : '+ Ajouter un arrivage';
    $('lg-hint').textContent = m === 'domaines' ? 'Du nord au sud. Utilisez les flèches de la fiche pour changer l’ordre.' : 'Le chiffre à gauche est le nombre de vins de l’arrivage. Les arrivages « À venir » s’affichent en tête de l’accueil.';
    $('lg-form').hidden = true; $('lg-form-arr').hidden = true; $('lg-empty').hidden = false;
    courant = null; arrCourant = null;
    rendreListe();
  }

  /* ---------- Fiche d'un domaine ---------- */
  function rendreRegions() {
    $('lg-region').innerHTML = DATA.regions.map(function (r) { return '<option>' + esc(r) + '</option>'; }).join('') + '<option value="__autre">Autre région…</option>';
  }
  function majUrl() {
    if (!courant) return;
    var u = domaineUrl(courant);
    $('lg-view').href = u; $('lg-view').textContent = u; $('lg-view-btn').href = u;
  }
  function ouvrir(id) {
    courant = DATA.domaines.find(function (d) { return d.id === id; }) || null;
    var f = $('lg-form');
    $('lg-form-arr').hidden = true;
    if (!courant) { f.hidden = true; $('lg-empty').hidden = false; rendreListe(); return; }
    $('lg-empty').hidden = true; f.hidden = false;
    ['nom', 'village', 'sousRegion', 'vigneron', 'fondation', 'surface', 'site', 'signature', 'description'].forEach(function (k) { f.elements[k].value = courant[k] || ''; });
    if (DATA.regions.indexOf(courant.region) === -1 && courant.region) { DATA.regions.push(courant.region); rendreRegions(); }
    f.elements.region.value = courant.region || DATA.regions[0];
    f.elements.pratique.value = courant.pratique || '';
    f.elements.visible.checked = courant.visible !== false;
    $('lg-form-title').textContent = courant.nom || 'Nouveau domaine';
    $('lg-form-eyebrow').textContent = (courant.village || '') + (courant.region ? ' · ' + courant.region : '');
    $('lg-order-n').textContent = pad(courant.ordre);
    majUrl(); rendrePhoto(); rendreVins(); rendreListe();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function rendrePhoto() {
    var img = $('lg-photo-img');
    if (courant.photo) { img.src = F.photoUrl(courant, ''); img.style.display = ''; }
    else { img.removeAttribute('src'); img.style.display = 'none'; }
  }
  function rendreVins() {
    var vins = courant.vins || (courant.vins = []);
    $('lg-wines-count').textContent = vins.length + (vins.length > 1 ? ' cuvées' : ' cuvée');
    $('lg-wines').innerHTML = vins.length ? vins.map(function (v, i) {
      return '<div class="lg-wine" data-i="' + i + '">' +
        '<label data-l="Nom"><input data-k="nom" value="' + esc(v.nom) + '" placeholder="Nom de la cuvée"></label>' +
        '<label data-l="Appellation"><input data-k="appellation" value="' + esc(v.appellation) + '" placeholder="Appellation"></label>' +
        '<label data-l="Couleur"><select data-k="couleur">' + COULEURS.map(function (c) { return '<option' + ((v.couleur || 'rouge') === c ? ' selected' : '') + '>' + c + '</option>'; }).join('') + '</select></label>' +
        '<label data-l="Cépage"><input data-k="cepage" value="' + esc(v.cepage) + '" placeholder="Cépage"></label>' +
        '<label data-l="Note"><input data-k="note" value="' + esc(v.note) + '" placeholder="Une phrase (facultatif)"></label>' +
        '<div class="lg-wine__tools"><button type="button" class="up" title="Monter">↑</button><button type="button" class="down" title="Descendre">↓</button><button type="button" class="del" title="Retirer">×</button></div>' +
        '</div>';
    }).join('') : '<p class="lg-wines__empty">Aucune cuvée pour l’instant. Ajoutez-en une.</p>';
  }
  function lirePhoto(file) {
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        var w = Math.min(1200, img.width), h = Math.round(img.height * w / img.width);
        var c = document.createElement('canvas'); c.width = w; c.height = h;
        c.getContext('2d').drawImage(img, 0, 0, w, h);
        courant.photo = c.toDataURL('image/jpeg', 0.82);
        rendrePhoto(); marquer(true);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  /* ---------- Fiche d'un arrivage ---------- */
  function ouvrirArr(id) {
    arrCourant = DATA.arrivages.find(function (a) { return a.id === id; }) || null;
    var f = $('lg-form-arr');
    $('lg-form').hidden = true;
    if (!arrCourant) { f.hidden = true; $('lg-empty').hidden = false; rendreListe(); return; }
    $('lg-empty').hidden = true; f.hidden = false;
    ['titre', 'dateTexte', 'date', 'texte'].forEach(function (k) { f.elements[k].value = arrCourant[k] || ''; });
    f.elements.statut.value = arrCourant.statut || 'a-venir';
    f.elements.visible.checked = arrCourant.visible !== false;
    $('lg-arr-title').textContent = arrCourant.titre || 'Nouvel arrivage';
    rendreFichier(); rendreLignes(); rendreListe();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function rendreFichier() {
    $('lg-fichier-nom').textContent = arrCourant.fichier
      ? 'Fichier téléversé : ' + (arrCourant.fichierNom || 'liste.pdf') + ' (remplace le PDF automatique).'
      : 'Aucun fichier : le PDF automatique est utilisé.';
    $('lg-fichier-remove').hidden = !arrCourant.fichier;
  }
  function lireFichier(file) {
    if (file.type !== 'application/pdf') { toast('Seul un fichier PDF est accepté.'); return; }
    if (file.size > 2 * 1024 * 1024) { toast('Fichier trop lourd pour la démonstration (2 Mo maximum).'); return; }
    var reader = new FileReader();
    reader.onload = function () { arrCourant.fichier = reader.result; arrCourant.fichierNom = file.name; rendreFichier(); marquer(true); };
    reader.readAsDataURL(file);
  }
  function apercuPdf() {
    var bin = window.LB_PDF.listeArrivages({ domaines: DATA.domaines, arrivages: DATA.arrivages }, { ids: [arrCourant.id], titre: arrCourant.titre });
    window.LB_PDF.telecharger(window.LB_PDF.nomFichier(arrCourant), bin);
  }
  function rendreLignes() {
    var lignes = arrCourant.lignes || (arrCourant.lignes = []);
    $('lg-lines-count').textContent = lignes.length + (lignes.length > 1 ? ' lignes' : ' ligne');
    var options = function (sel) {
      return '<option value="">Autre / à préciser</option>' + DATA.domaines.slice().sort(function (a, b) { return (a.ordre || 0) - (b.ordre || 0); })
        .map(function (d) { return '<option value="' + esc(d.id) + '"' + (d.id === sel ? ' selected' : '') + '>' + esc(d.nom) + '</option>'; }).join('');
    };
    $('lg-lines').innerHTML = lignes.length ? lignes.map(function (l, i) {
      return '<div class="lg-line" data-i="' + i + '">' +
        '<label data-l="Domaine"><select data-k="domaineId">' + options(l.domaineId) + '</select></label>' +
        '<label data-l="Cuvée"><input data-k="cuvee" value="' + esc(l.cuvee) + '" placeholder="Cuvée"></label>' +
        '<label data-l="Millésime"><input data-k="millesime" value="' + esc(l.millesime) + '" placeholder="2023"></label>' +
        '<label data-l="Format"><input data-k="format" value="' + esc(l.format) + '" placeholder="Caisse de 6"></label>' +
        '<label data-l="Quantité"><input data-k="quantite" value="' + esc(l.quantite) + '" placeholder="8 caisses"></label>' +
        '<label data-l="Prix"><input data-k="prix" value="' + esc(l.prix) + '" placeholder="facultatif"></label>' +
        '<label data-l="Note"><input data-k="note" value="' + esc(l.note) + '" placeholder="Allocation, rareté…"></label>' +
        '<div class="lg-wine__tools"><button type="button" class="up" title="Monter">↑</button><button type="button" class="down" title="Descendre">↓</button><button type="button" class="del" title="Retirer">×</button></div>' +
        '</div>';
    }).join('') : '<p class="lg-wines__empty">Aucun vin dans cet arrivage. Ajoutez-en un.</p>';
  }

  /* ---------- Export ---------- */
  function exporter() {
    renumeroter();
    var entete = '/* LES BOURGUIGNOLS : DONNÉES DU SITE (domaines, cuvées, arrivages)\n   Fichier exporté depuis le module de gestion le ' + new Date().toLocaleDateString('fr-CA') + '.\n   À déposer dans le dossier js/ du site (il remplace l’ancien), puis lancer : node build-pages.js */\n';
    var blob = new Blob([entete + 'window.LB_DATA = ' + JSON.stringify(DATA, null, 2) + ';\n'], { type: 'text/javascript;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'domaines-data.js';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
    toast('Fichier domaines-data.js téléchargé.');
  }

  /* ---------- Outils communs aux tableaux (cuvées, lignes) ---------- */
  function outils(conteneur, getTableau, rerendre) {
    conteneur.addEventListener('input', function (e) {
      var row = e.target.closest('[data-i]'); if (!row) return;
      var item = getTableau()[parseInt(row.getAttribute('data-i'), 10)];
      var k = e.target.getAttribute('data-k');
      if (item && k) { item[k] = e.target.value; marquer(true); }
    });
    conteneur.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var row = b.closest('[data-i]'); var i = parseInt(row.getAttribute('data-i'), 10);
      var t = getTableau();
      if (b.classList.contains('del')) t.splice(i, 1);
      else if (b.classList.contains('up') && i > 0) t.splice(i - 1, 0, t.splice(i, 1)[0]);
      else if (b.classList.contains('down') && i < t.length - 1) t.splice(i + 1, 0, t.splice(i, 1)[0]);
      else return;
      marquer(true); rerendre();
    });
  }

  /* ---------- Liaisons ---------- */
  function lier() {
    var f = $('lg-form'), fa = $('lg-form-arr');

    document.querySelector('.lg-mode').addEventListener('click', function (e) {
      var b = e.target.closest('button[data-mode]');
      if (b) changerMode(b.getAttribute('data-mode'));
    });
    $('lg-items').addEventListener('click', function (e) {
      var li = e.target.closest('.lg-item');
      if (!li) return;
      if (li.hasAttribute('data-id')) ouvrir(li.getAttribute('data-id'));
      else if (li.hasAttribute('data-arr')) ouvrirArr(li.getAttribute('data-arr'));
    });
    $('lg-filter').addEventListener('input', function (e) { filtre = e.target.value.trim(); rendreListe(); });

    $('lg-add').addEventListener('click', function () {
      if (mode === 'domaines') {
        var base = 'nouveau-domaine', id = base, n = 2;
        while (DATA.domaines.some(function (d) { return d.id === id; })) id = base + '-' + (n++);
        DATA.domaines.push({ id: id, ordre: DATA.domaines.length + 1, nom: '', village: '', region: DATA.regions[0] || '', sousRegion: null, vigneron: null, fondation: null, surface: null, pratique: null, signature: '', description: '', site: null, photo: '', visible: true, vins: [] });
        marquer(true); ouvrir(id); f.elements.nom.focus();
      } else {
        var b2 = 'arrivage', id2 = b2, m = 2;
        while (DATA.arrivages.some(function (a) { return a.id === id2; })) id2 = b2 + '-' + (m++);
        DATA.arrivages.push({ id: id2, titre: '', date: '', dateTexte: '', statut: 'a-venir', visible: true, texte: '', lignes: [] });
        marquer(true); ouvrirArr(id2); fa.elements.titre.focus();
      }
    });

    // Champs du domaine
    f.addEventListener('input', function (e) {
      var el = e.target;
      if (!courant || !el.name) return;
      if (el.name === 'visible') courant.visible = el.checked;
      else if (el.name === 'region') {
        if (el.value === '__autre') {
          var r = prompt('Nom de la nouvelle région');
          if (r && r.trim()) { DATA.regions.push(r.trim()); rendreRegions(); el.value = r.trim(); courant.region = r.trim(); }
          else el.value = courant.region || DATA.regions[0];
        } else courant.region = el.value;
      }
      else courant[el.name] = el.value.trim() === '' ? null : el.value;
      if (el.name === 'nom') {
        courant.nom = el.value;
        $('lg-form-title').textContent = el.value || 'Nouveau domaine';
        if (/^nouveau-domaine/.test(courant.id) && el.value.trim()) {
          var s = slug(el.value), id = s, n = 2;
          while (DATA.domaines.some(function (x) { return x !== courant && x.id === id; })) id = s + '-' + (n++);
          courant.id = id; majUrl();
        }
      }
      if (el.name === 'village' || el.name === 'region') $('lg-form-eyebrow').textContent = (courant.village || '') + (courant.region ? ' · ' + courant.region : '');
      marquer(true);
      if (el.name === 'nom' || el.name === 'village' || el.name === 'visible') rendreListe();
    });
    f.addEventListener('change', function (e) { if (e.target.name === 'region') f.dispatchEvent(new Event('input')); });
    outils($('lg-wines'), function () { return courant.vins; }, rendreVins);
    $('lg-wine-add').addEventListener('click', function () {
      courant.vins.push({ nom: '', appellation: '', couleur: 'rouge', cepage: '', note: '' });
      marquer(true); rendreVins();
      var inp = $('lg-wines').querySelector('.lg-wine:last-child input'); if (inp) inp.focus();
    });
    function deplacer(delta) {
      renumeroter();
      var i = DATA.domaines.indexOf(courant), j = i + delta;
      if (j < 0 || j >= DATA.domaines.length) return;
      DATA.domaines.splice(j, 0, DATA.domaines.splice(i, 1)[0]);
      DATA.domaines.forEach(function (d, k) { d.ordre = k + 1; });
      $('lg-order-n').textContent = pad(courant.ordre);
      marquer(true); rendreListe();
    }
    $('lg-up').addEventListener('click', function () { deplacer(-1); });
    $('lg-down').addEventListener('click', function () { deplacer(1); });
    $('lg-photo-file').addEventListener('change', function (e) { if (e.target.files[0]) lirePhoto(e.target.files[0]); e.target.value = ''; });
    $('lg-photo-remove').addEventListener('click', function () { courant.photo = ''; rendrePhoto(); marquer(true); });
    $('lg-copy').addEventListener('click', function () {
      var u = domaineUrl(courant);
      var ok = function () { toast('Lien copié : ' + u); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(u).then(ok, function () { prompt('Copiez ce lien :', u); });
      else prompt('Copiez ce lien :', u);
    });
    $('lg-delete').addEventListener('click', function () {
      if (!confirm('Retirer « ' + (courant.nom || 'ce domaine') + ' » du site ? Vous pourrez rétablir la version d’origine plus tard.')) return;
      DATA.domaines = DATA.domaines.filter(function (d) { return d !== courant; });
      courant = null; enregistrer(); ouvrir(null);
    });
    f.addEventListener('submit', function (e) { e.preventDefault(); enregistrer(); });

    // Champs de l'arrivage
    fa.addEventListener('input', function (e) {
      var el = e.target;
      if (!arrCourant || !el.name) return;
      if (el.name === 'visible') arrCourant.visible = el.checked;
      else arrCourant[el.name] = el.value;
      if (el.name === 'titre') {
        $('lg-arr-title').textContent = el.value || 'Nouvel arrivage';
        if (/^arrivage(-\d+)?$/.test(arrCourant.id) && el.value.trim()) {
          var s = F.slug(el.value), id = s, n = 2;
          while (DATA.arrivages.some(function (x) { return x !== arrCourant && x.id === id; })) id = s + '-' + (n++);
          arrCourant.id = id;
        }
      }
      marquer(true);
      if (el.name === 'titre' || el.name === 'statut' || el.name === 'visible' || el.name === 'dateTexte') rendreListe();
    });
    outils($('lg-lines'), function () { return arrCourant.lignes; }, rendreLignes);
    $('lg-line-add').addEventListener('click', function () {
      arrCourant.lignes.push({ domaineId: '', cuvee: '', millesime: '', format: 'Caisse de 6', quantite: '', prix: '', note: '' });
      marquer(true); rendreLignes();
      var inp = $('lg-lines').querySelector('.lg-line:last-child input'); if (inp) inp.focus();
    });
    $('lg-fichier').addEventListener('change', function (e) { if (e.target.files[0]) lireFichier(e.target.files[0]); e.target.value = ''; });
    $('lg-fichier-remove').addEventListener('click', function () { arrCourant.fichier = ''; arrCourant.fichierNom = ''; rendreFichier(); marquer(true); });
    $('lg-arr-apercu').addEventListener('click', apercuPdf);
    $('lg-arr-delete').addEventListener('click', function () {
      if (!confirm('Retirer l’arrivage « ' + (arrCourant.titre || 'sans titre') + ' » ?')) return;
      DATA.arrivages = DATA.arrivages.filter(function (a) { return a !== arrCourant; });
      arrCourant = null; enregistrer(); ouvrirArr(null);
    });
    fa.addEventListener('submit', function (e) { e.preventDefault(); enregistrer(); });

    // Commun
    $('lg-save').addEventListener('click', enregistrer);
    $('lg-export').addEventListener('click', exporter);
    $('lg-reset').addEventListener('click', function () {
      if (!confirm('Effacer toutes vos modifications et revenir à la version d’origine (25 domaines, arrivages d’exemple) ?')) return;
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* rien */ }
      DATA = charger(); courant = null; arrCourant = null; marquer(false); rendreRegions(); changerMode(mode);
      toast('Version d’origine rétablie.');
    });
    window.addEventListener('beforeunload', function (e) { if (sale) { e.preventDefault(); e.returnValue = ''; } });
    document.addEventListener('keydown', function (e) { if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); enregistrer(); } });
  }

  rendreRegions();
  changerMode('domaines');
  lier();
  marquer(false);
})();
