/* ============================================================
   LES BOURGUIGNOLS : logique de la page publique
   - Lit les domaines (fichier domaines-data.js, ou la version
     modifiée dans le module de gestion, gardée dans le navigateur)
   - Itinéraire, filtres, recherche, grille de fiches
   - Fiche détaillée (modale) avec navigation précédent / suivant
   ============================================================ */
(function () {
  'use strict';

  var STORAGE_KEY = 'lb_domaines_v1';
  var COULEURS = [
    ['effervescent', 'Effervescents'],
    ['blanc', 'Blancs'],
    ['rose', 'Rosés'],
    ['rouge', 'Rouges']
  ];

  /* ---------- Données ---------- */
  function chargerDonnees() {
    var base = window.LB_DATA || { regions: [], domaines: [] };
    try {
      var brut = localStorage.getItem(STORAGE_KEY);
      if (brut) {
        var perso = JSON.parse(brut);
        if (perso && Array.isArray(perso.domaines)) {
          return { regions: perso.regions || base.regions, domaines: perso.domaines };
        }
      }
    } catch (e) { /* stockage indisponible : on garde la version de base */ }
    return base;
  }

  var DATA = chargerDonnees();
  var DOMAINES = DATA.domaines
    .filter(function (d) { return d.visible !== false; })
    .sort(function (a, b) { return (a.ordre || 0) - (b.ordre || 0); });
  var REGIONS = DATA.regions;

  var etat = { region: 'all', q: '' };
  var listeCourante = [];
  var indexCourant = -1;

  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var norm = function (s) {
    return String(s == null ? '' : s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };
  var PLACEHOLDER = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"><rect width="600" height="400" fill="#e2d9c6"/>' +
    '<text x="300" y="212" font-family="Georgia,serif" font-style="italic" font-size="26" fill="#7d736b" text-anchor="middle">Photo à venir</text></svg>');
  var photoDe = function (d) { return d.photo || PLACEHOLDER; };
  var couleurCle = function (c) { return norm(c).replace(/[^a-z]/g, ''); };
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };

  /* ---------- Itinéraire (hero) et filtres ---------- */
  function compterRegions() {
    var c = {};
    DOMAINES.forEach(function (d) { c[d.region] = (c[d.region] || 0) + 1; });
    return c;
  }

  function rendreItineraire() {
    var ul = $('lb-itin');
    if (!ul) return;
    var c = compterRegions();
    ul.innerHTML = REGIONS.filter(function (r) { return c[r]; }).map(function (r) {
      return '<li><button type="button" data-region="' + esc(r) + '">' + esc(r) + '</button><span class="dots"></span><span class="n">' + c[r] + '</span></li>';
    }).join('');
    ul.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-region]');
      if (!b) return;
      etat.region = b.getAttribute('data-region');
      rendreFiltres();
      rendreGrille();
      var sec = $('domaines');
      if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function rendreFiltres() {
    var box = $('lb-filters');
    if (!box) return;
    var c = compterRegions();
    var chips = [{ k: 'all', l: 'Tous', n: DOMAINES.length }].concat(
      REGIONS.filter(function (r) { return c[r]; }).map(function (r) { return { k: r, l: r, n: c[r] }; })
    );
    box.querySelectorAll('.lb-chip').forEach(function (el) { el.remove(); });
    var frag = document.createDocumentFragment();
    chips.forEach(function (ch) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'lb-chip' + (etat.region === ch.k ? ' is-active' : '');
      b.setAttribute('data-region', ch.k);
      b.innerHTML = esc(ch.l) + '<span class="k">' + ch.n + '</span>';
      frag.appendChild(b);
    });
    box.insertBefore(frag, box.firstChild);
  }

  /* ---------- Grille ---------- */
  function correspond(d) {
    if (etat.region !== 'all' && d.region !== etat.region) return false;
    if (!etat.q) return true;
    var q = norm(etat.q);
    var texte = [d.nom, d.village, d.region, d.sousRegion, d.vigneron, d.signature]
      .concat((d.vins || []).map(function (v) { return [v.nom, v.appellation, v.cepage].join(' '); }))
      .join(' ');
    return norm(texte).indexOf(q) !== -1;
  }

  function rendreGrille() {
    var grid = $('lb-grid');
    if (!grid) return;
    listeCourante = DOMAINES.filter(correspond);
    if (!listeCourante.length) {
      grid.innerHTML = '<p class="lb-empty">Aucun domaine ne correspond à cette recherche.</p>';
    } else {
      grid.innerHTML = listeCourante.map(function (d, i) {
        var nb = (d.vins || []).length;
        return '<button type="button" class="lb-card rev is-in" data-i="' + i + '">' +
          '<div class="lb-card__img"><img src="' + esc(photoDe(d)) + '" alt="' + esc(d.nom) + '" loading="lazy"><div class="lb-card__num">' + pad(d.ordre) + '</div></div>' +
          '<div class="lb-card__body">' +
            '<div class="lb-card__where"><span>' + esc(d.village) + '</span><span class="reg">' + esc(d.region) + '</span></div>' +
            '<h3>' + esc(d.nom) + '</h3>' +
            (d.signature ? '<p class="lb-card__sig">' + esc(d.signature) + '</p>' : '') +
            '<div class="lb-card__foot"><span>' + nb + (nb > 1 ? ' cuvées' : ' cuvée') + '</span><span class="cta">Voir les vins →</span></div>' +
          '</div></button>';
      }).join('');
    }
    var count = $('lb-count');
    if (count) {
      var totalVins = listeCourante.reduce(function (s, d) { return s + (d.vins || []).length; }, 0);
      count.textContent = listeCourante.length + (listeCourante.length > 1 ? ' domaines · ' : ' domaine · ') + totalVins + (totalVins > 1 ? ' cuvées' : ' cuvée');
    }
  }

  /* ---------- Fiche (modale) ---------- */
  function ouvrirFiche(i) {
    var d = listeCourante[i];
    if (!d) return;
    indexCourant = i;
    $('lb-modal-img').src = photoDe(d);
    $('lb-modal-img').alt = d.nom;
    $('lb-modal-num').textContent = pad(d.ordre);
    $('lb-modal-caption').textContent = d.village + (d.sousRegion ? ', ' + d.sousRegion : '') + ' · ' + d.region;

    var meta = [];
    if (d.vigneron) meta.push(['Vigneron', d.vigneron]);
    if (d.fondation) meta.push(['Depuis', d.fondation]);
    if (d.surface) meta.push(['Surface', d.surface]);
    if (d.pratique) meta.push(['Culture', d.pratique]);

    var groupes = COULEURS.map(function (c) {
      var vins = (d.vins || []).filter(function (v) { return couleurCle(v.couleur) === c[0]; });
      if (!vins.length) return '';
      return '<h3>' + c[1] + '</h3><ul>' + vins.map(function (v) {
        return '<li><div class="lb-wine__row"><span class="lb-wine__name">' + esc(v.nom) + '</span><span class="lb-wine__dots"></span><span class="lb-wine__app">' + esc(v.appellation) + '</span></div>' +
          (v.cepage || v.note ? '<p class="lb-wine__note">' + (v.cepage ? '<span class="lb-wine__tag">' + esc(v.cepage) + '</span>' : '') + esc(v.note || '') + '</p>' : '') + '</li>';
      }).join('') + '</ul>';
    }).join('');

    $('lb-modal-content').innerHTML =
      '<p class="eyebrow">' + esc(d.village) + ' · ' + esc(d.region) + '</p>' +
      '<h2 id="lb-modal-title">' + esc(d.nom) + '</h2>' +
      (d.signature ? '<p class="lb-modal__sig">' + esc(d.signature) + '</p>' : '') +
      (d.description ? '<p class="lb-modal__desc">' + esc(d.description) + '</p>' : '') +
      (meta.length ? '<dl class="lb-meta">' + meta.map(function (m) { return '<div><dt>' + m[0] + '</dt><dd>' + esc(m[1]) + '</dd></div>'; }).join('') + '</dl>' : '') +
      '<div class="lb-wines">' + (groupes || '<p class="lb-modal__desc">La liste des cuvées sera précisée sous peu.</p>') + '</div>' +
      (d.site ? '<a class="lb-modal__site" href="' + esc(d.site) + '" target="_blank" rel="noopener">Site du domaine ↗</a>' : '') +
      '<div class="lb-modal__order"><p>Ces cuvées vous parlent ?</p><a class="lb-btn lb-btn--vin" href="#contact" data-close>Demander les disponibilités</a></div>';

    var m = $('lb-modal');
    m.classList.add('is-open');
    document.body.classList.add('lb-noscroll');
    $('lb-modal-content').scrollTop = 0;
    $('lb-prev').disabled = i === 0;
    $('lb-next').disabled = i === listeCourante.length - 1;
    $('lb-prev').style.opacity = i === 0 ? '.35' : '';
    $('lb-next').style.opacity = i === listeCourante.length - 1 ? '.35' : '';
    if (history.replaceState) history.replaceState(null, '', '#domaine=' + d.id);
    var sheet = m.querySelector('.lb-modal__sheet');
    if (sheet) sheet.scrollTop = 0;
    $('lb-modal').querySelector('.lb-modal__close').focus();
  }

  function fermerFiche() {
    $('lb-modal').classList.remove('is-open');
    document.body.classList.remove('lb-noscroll');
    if (history.replaceState) history.replaceState(null, '', location.pathname + location.search);
  }

  function lierModale() {
    var m = $('lb-modal');
    m.addEventListener('click', function (e) {
      if (e.target.closest('[data-close]')) fermerFiche();
    });
    $('lb-prev').addEventListener('click', function () { if (indexCourant > 0) ouvrirFiche(indexCourant - 1); });
    $('lb-next').addEventListener('click', function () { if (indexCourant < listeCourante.length - 1) ouvrirFiche(indexCourant + 1); });
    document.addEventListener('keydown', function (e) {
      if (!m.classList.contains('is-open')) return;
      if (e.key === 'Escape') fermerFiche();
      if (e.key === 'ArrowLeft' && indexCourant > 0) ouvrirFiche(indexCourant - 1);
      if (e.key === 'ArrowRight' && indexCourant < listeCourante.length - 1) ouvrirFiche(indexCourant + 1);
    });
    $('lb-grid').addEventListener('click', function (e) {
      var card = e.target.closest('.lb-card');
      if (card) ouvrirFiche(parseInt(card.getAttribute('data-i'), 10));
    });
  }

  function ouvrirDepuisAdresse() {
    var m = /#domaine=([a-z0-9-]+)/.exec(location.hash || '');
    if (!m) return;
    var i = listeCourante.findIndex(function (d) { return d.id === m[1]; });
    if (i >= 0) ouvrirFiche(i);
  }

  /* ---------- Filtres et recherche ---------- */
  function lierFiltres() {
    $('lb-filters').addEventListener('click', function (e) {
      var b = e.target.closest('.lb-chip');
      if (!b) return;
      etat.region = b.getAttribute('data-region');
      rendreFiltres();
      rendreGrille();
    });
    var timer;
    $('lb-search').addEventListener('input', function (e) {
      clearTimeout(timer);
      timer = setTimeout(function () { etat.q = e.target.value.trim(); rendreGrille(); }, 120);
    });
  }

  /* ---------- Navigation, révélation, formulaire, bandeau ---------- */
  function lierNav() {
    var nav = $('lb-nav'), burger = $('lb-burger');
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) { nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); }
    });
  }

  function lierReveal() {
    var els = document.querySelectorAll('.rev');
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  }

  function lierFormulaire() {
    var f = $('lb-form');
    if (!f) return;
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var fd = new FormData(f);
      var sujet = 'Demande via lesbourguignols.com (' + (fd.get('profil') || '') + ')';
      var corps = 'Nom : ' + (fd.get('nom') || '') + '\nCourriel : ' + (fd.get('courriel') || '') + '\n\n' + (fd.get('message') || '') +
        (fd.get('liste') ? '\n\nJe souhaite recevoir la liste des disponibilités.' : '');
      location.href = 'mailto:contact@lesbourguignols.com?subject=' + encodeURIComponent(sujet) + '&body=' + encodeURIComponent(corps);
    });
  }

  function lierBandeau() {
    var b = $('lb-demo'), x = $('lb-demo-close');
    if (!b || !x) return;
    x.addEventListener('click', function () { b.remove(); });
  }

  function rendreFaits() {
    var a = $('lb-fact-domaines'), b = $('lb-fact-cuvees');
    if (a) a.textContent = DOMAINES.length;
    if (b) b.textContent = DOMAINES.reduce(function (s, d) { return s + (d.vins || []).length; }, 0);
  }

  /* ---------- Démarrage ---------- */
  rendreItineraire();
  rendreFiltres();
  rendreGrille();
  rendreFaits();
  lierModale();
  lierFiltres();
  lierNav();
  lierReveal();
  lierFormulaire();
  lierBandeau();
  ouvrirDepuisAdresse();

  window.LB = { data: DATA, domaines: DOMAINES, ouvrir: ouvrirFiche };
})();
