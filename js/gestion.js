/* ============================================================
   LES BOURGUIGNOLS : module de gestion (démonstration)
   Ajouter, modifier, retirer des domaines et leurs cuvées.
   Les changements sont gardés dans le navigateur (localStorage)
   et lus par la page publique. Le bouton « Exporter » produit le
   fichier domaines-data.js à remettre dans le site.
   ============================================================ */
(function () {
  'use strict';

  var STORAGE_KEY = 'lb_domaines_v1';
  var COULEURS = ['rouge', 'blanc', 'rosé', 'effervescent'];
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var slug = function (s) {
    return String(s || 'domaine').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/^domaine\s+/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'domaine';
  };

  /* ---------- Données ---------- */
  function copie(o) { return JSON.parse(JSON.stringify(o)); }
  function charger() {
    var base = copie(window.LB_DATA || { regions: [], domaines: [] });
    try {
      var brut = localStorage.getItem(STORAGE_KEY);
      if (brut) {
        var perso = JSON.parse(brut);
        if (perso && Array.isArray(perso.domaines)) return { regions: perso.regions || base.regions, domaines: perso.domaines };
      }
    } catch (e) { /* on garde la base */ }
    return base;
  }

  var DATA = charger();
  var courant = null;      // domaine en cours d'édition
  var sale = false;        // modifications non enregistrées
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
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toast.timer);
    toast.timer = setTimeout(function () { t.hidden = true; }, 3200);
  }

  /* ---------- Liste ---------- */
  function rendreListe() {
    renumeroter();
    var q = filtre.toLowerCase();
    $('lg-items').innerHTML = DATA.domaines.filter(function (d) {
      return !q || (d.nom + ' ' + d.village + ' ' + d.region).toLowerCase().indexOf(q) !== -1;
    }).map(function (d) {
      return '<li class="lg-item' + (courant && courant.id === d.id ? ' is-active' : '') + '" data-id="' + esc(d.id) + '">' +
        '<span class="lg-item__n">' + pad(d.ordre) + '</span>' +
        '<span><span class="lg-item__name">' + esc(d.nom || 'Sans nom') + '</span><br><span class="lg-item__where">' + esc(d.village || '') + (d.region ? ' · ' + esc(d.region) : '') + '</span></span>' +
        (d.visible === false ? '<span class="lg-item__badge">Masqué</span>' : '<span class="lg-item__badge" style="border-color:transparent">' + (d.vins || []).length + ' cuv.</span>') +
        '</li>';
    }).join('') || '<li class="lg-wines__empty" style="padding:14px">Aucun domaine.</li>';
  }

  /* ---------- Fiche ---------- */
  function rendreRegions() {
    $('lg-region').innerHTML = DATA.regions.map(function (r) { return '<option>' + esc(r) + '</option>'; }).join('') + '<option value="__autre">Autre région…</option>';
  }

  function ouvrir(id) {
    courant = DATA.domaines.find(function (d) { return d.id === id; }) || null;
    var f = $('lg-form');
    if (!courant) { f.hidden = true; $('lg-empty').hidden = false; rendreListe(); return; }
    $('lg-empty').hidden = true;
    f.hidden = false;
    ['nom', 'village', 'sousRegion', 'vigneron', 'fondation', 'surface', 'site', 'signature', 'description'].forEach(function (k) {
      f.elements[k].value = courant[k] || '';
    });
    if (DATA.regions.indexOf(courant.region) === -1 && courant.region) { DATA.regions.push(courant.region); rendreRegions(); }
    f.elements.region.value = courant.region || DATA.regions[0];
    f.elements.pratique.value = courant.pratique || '';
    f.elements.visible.checked = courant.visible !== false;
    $('lg-form-title').textContent = courant.nom || 'Nouveau domaine';
    $('lg-form-eyebrow').textContent = (courant.village || '') + (courant.region ? ' · ' + courant.region : '');
    $('lg-order-n').textContent = pad(courant.ordre);
    $('lg-view').href = 'index.html#domaine=' + encodeURIComponent(courant.id);
    rendrePhoto();
    rendreVins();
    rendreListe();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function rendrePhoto() {
    var img = $('lg-photo-img');
    if (courant.photo) { img.src = courant.photo; img.style.display = ''; }
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

  /* ---------- Photo : redimensionnée dans le navigateur ---------- */
  function lirePhoto(file) {
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        var w = Math.min(1200, img.width), h = Math.round(img.height * w / img.width);
        var c = document.createElement('canvas'); c.width = w; c.height = h;
        c.getContext('2d').drawImage(img, 0, 0, w, h);
        courant.photo = c.toDataURL('image/jpeg', 0.82);
        rendrePhoto();
        marquer(true);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  /* ---------- Export du fichier de données ---------- */
  function exporter() {
    renumeroter();
    var entete = '/* LES BOURGUIGNOLS : DONNÉES DES DOMAINES\n   Fichier exporté depuis le module de gestion le ' + new Date().toLocaleDateString('fr-CA') + '.\n   À déposer dans le dossier js/ du site (il remplace l’ancien). */\n';
    var blob = new Blob([entete + 'window.LB_DATA = ' + JSON.stringify(DATA, null, 2) + ';\n'], { type: 'text/javascript;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'domaines-data.js';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
    toast('Fichier domaines-data.js téléchargé.');
  }

  /* ---------- Liaisons ---------- */
  function lier() {
    var f = $('lg-form');

    $('lg-items').addEventListener('click', function (e) {
      var li = e.target.closest('.lg-item[data-id]');
      if (li) ouvrir(li.getAttribute('data-id'));
    });
    $('lg-filter').addEventListener('input', function (e) { filtre = e.target.value.trim(); rendreListe(); });

    $('lg-add').addEventListener('click', function () {
      var base = 'nouveau-domaine', id = base, n = 2;
      while (DATA.domaines.some(function (d) { return d.id === id; })) id = base + '-' + (n++);
      var d = { id: id, ordre: DATA.domaines.length + 1, nom: '', village: '', region: DATA.regions[0] || '', sousRegion: null, vigneron: null, fondation: null, surface: null, pratique: null, signature: '', description: '', site: null, photo: '', visible: true, vins: [] };
      DATA.domaines.push(d);
      marquer(true);
      ouvrir(id);
      f.elements.nom.focus();
    });

    // Champs du domaine : mise à jour immédiate du modèle
    f.addEventListener('input', function (e) {
      var el = e.target;
      if (!courant || !el.name) return;
      if (el.name === 'visible') { courant.visible = el.checked; }
      else if (el.name === 'region') {
        if (el.value === '__autre') {
          var r = prompt('Nom de la nouvelle région');
          if (r && r.trim()) { DATA.regions.push(r.trim()); rendreRegions(); el.value = r.trim(); courant.region = r.trim(); }
          else { el.value = courant.region || DATA.regions[0]; }
        } else courant.region = el.value;
      }
      else { courant[el.name] = el.value.trim() === '' ? null : el.value; }
      if (el.name === 'nom') {
        courant.nom = el.value;
        $('lg-form-title').textContent = el.value || 'Nouveau domaine';
        // un identifiant lisible pour un domaine tout neuf
        if (/^nouveau-domaine/.test(courant.id) && el.value.trim()) {
          var s = slug(el.value), id = s, n = 2;
          while (DATA.domaines.some(function (x) { return x !== courant && x.id === id; })) id = s + '-' + (n++);
          courant.id = id;
          $('lg-view').href = 'index.html#domaine=' + encodeURIComponent(id);
        }
      }
      if (el.name === 'village' || el.name === 'region') $('lg-form-eyebrow').textContent = (courant.village || '') + (courant.region ? ' · ' + courant.region : '');
      marquer(true);
      if (el.name === 'nom' || el.name === 'village' || el.name === 'visible') rendreListe();
    });
    f.addEventListener('change', function (e) { if (e.target.name === 'region') f.dispatchEvent(new Event('input')); });

    // Cuvées
    $('lg-wines').addEventListener('input', function (e) {
      var row = e.target.closest('.lg-wine'); if (!row) return;
      var v = courant.vins[parseInt(row.getAttribute('data-i'), 10)];
      var k = e.target.getAttribute('data-k');
      if (v && k) { v[k] = e.target.value; marquer(true); }
    });
    $('lg-wines').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var row = b.closest('.lg-wine'); var i = parseInt(row.getAttribute('data-i'), 10);
      var vins = courant.vins;
      if (b.classList.contains('del')) { vins.splice(i, 1); }
      else if (b.classList.contains('up') && i > 0) { vins.splice(i - 1, 0, vins.splice(i, 1)[0]); }
      else if (b.classList.contains('down') && i < vins.length - 1) { vins.splice(i + 1, 0, vins.splice(i, 1)[0]); }
      else return;
      marquer(true); rendreVins();
    });
    $('lg-wine-add').addEventListener('click', function () {
      courant.vins.push({ nom: '', appellation: '', couleur: 'rouge', cepage: '', note: '' });
      marquer(true); rendreVins();
      var inputs = $('lg-wines').querySelectorAll('.lg-wine:last-child input');
      if (inputs[0]) inputs[0].focus();
    });

    // Ordre
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

    // Photo
    $('lg-photo-file').addEventListener('change', function (e) { if (e.target.files[0]) lirePhoto(e.target.files[0]); e.target.value = ''; });
    $('lg-photo-remove').addEventListener('click', function () { courant.photo = ''; rendrePhoto(); marquer(true); });

    // Retirer, enregistrer, exporter, rétablir
    $('lg-delete').addEventListener('click', function () {
      if (!confirm('Retirer « ' + (courant.nom || 'ce domaine') + ' » du site ? Vous pourrez rétablir la version d’origine plus tard.')) return;
      DATA.domaines = DATA.domaines.filter(function (d) { return d !== courant; });
      courant = null; marquer(true); enregistrer(); ouvrir(null);
    });
    f.addEventListener('submit', function (e) { e.preventDefault(); enregistrer(); });
    $('lg-save').addEventListener('click', enregistrer);
    $('lg-export').addEventListener('click', exporter);
    $('lg-reset').addEventListener('click', function () {
      if (!confirm('Effacer toutes vos modifications et revenir aux 25 domaines d’origine ?')) return;
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* rien */ }
      DATA = charger(); courant = null; marquer(false); rendreRegions(); ouvrir(null);
      toast('Version d’origine rétablie.');
    });
    window.addEventListener('beforeunload', function (e) { if (sale) { e.preventDefault(); e.returnValue = ''; } });
    document.addEventListener('keydown', function (e) { if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); enregistrer(); } });
  }

  rendreRegions();
  rendreListe();
  lier();
  marquer(false);
})();
