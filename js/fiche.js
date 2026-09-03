/* ============================================================
   LES BOURGUIGNOLS : rendu d'une fiche de domaine
   Partagé par la page d'accueil (fenêtre), les pages de domaine
   (domaines/<id>/) et le script de construction build-pages.js.
   ============================================================ */
(function (root) {
  'use strict';

  var COULEURS = [['effervescent', 'Effervescents'], ['blanc', 'Blancs'], ['rose', 'Rosés'], ['rouge', 'Rouges']];
  var PLACEHOLDER = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"><rect width="600" height="400" fill="#e2d9c6"/>' +
    '<text x="300" y="212" font-family="Georgia,serif" font-style="italic" font-size="26" fill="#7d736b" text-anchor="middle">Photo à venir</text></svg>');

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function norm(s) { return String(s == null ? '' : s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function slug(s) { return norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'x'; }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function couleurCle(c) { return norm(c).replace(/[^a-z]/g, ''); }
  function photoUrl(d, base) {
    var p = d.photo || '';
    if (!p) return PLACEHOLDER;
    if (/^(data:|https?:|\/)/.test(p)) return p;
    return (base || '') + p;
  }
  /* Adresse de la page d'un domaine : page statique si elle existe, sinon la page générique */
  function pageUrl(d, base, data) {
    var statique = data && data.domaines && data.domaines.some(function (x) { return x.id === d.id; });
    return (base || '') + (statique ? 'domaines/' + d.id + '/' : 'domaine.html?id=' + encodeURIComponent(d.id));
  }

  function renderMeta(d) {
    var meta = [];
    if (d.vigneron) meta.push(['Vigneron', d.vigneron]);
    if (d.fondation) meta.push(['Depuis', d.fondation]);
    if (d.surface) meta.push(['Surface', d.surface]);
    if (d.pratique) meta.push(['Culture', d.pratique]);
    if (!meta.length) return '';
    return '<dl class="lb-meta">' + meta.map(function (m) { return '<div><dt>' + m[0] + '</dt><dd>' + esc(m[1]) + '</dd></div>'; }).join('') + '</dl>';
  }

  function renderVins(d, opts) {
    opts = opts || {};
    var groupes = COULEURS.map(function (c) {
      var vins = (d.vins || []).filter(function (v) { return couleurCle(v.couleur) === c[0]; });
      if (!vins.length) return '';
      return '<h3>' + c[1] + '</h3><ul>' + vins.map(function (v) {
        var id = 'cuvee-' + slug(v.nom);
        return '<li id="' + id + '"><div class="lb-wine__row"><span class="lb-wine__name">' + esc(v.nom) + '</span><span class="lb-wine__dots"></span><span class="lb-wine__app">' + esc(v.appellation) + '</span>' +
          (opts.liens ? '<a class="lb-wine__link" href="#' + id + '" title="Lien direct vers cette cuvée">#</a>' : '') + '</div>' +
          (v.cepage || v.note ? '<p class="lb-wine__note">' + (v.cepage ? '<span class="lb-wine__tag">' + esc(v.cepage) + '</span>' : '') + esc(v.note || '') + '</p>' : '') + '</li>';
      }).join('') + '</ul>';
    }).join('');
    return '<div class="lb-wines">' + (groupes || '<p class="lb-modal__desc">La liste des cuvées sera précisée sous peu.</p>') + '</div>';
  }

  /* Page complète d'un domaine (contenu de <main>) */
  function renderFiche(d, base, opts) {
    opts = opts || {};
    base = base || '';
    var sujet = encodeURIComponent('Disponibilités : ' + d.nom);
    var nav = '';
    if (opts.prev || opts.next) {
      nav = '<nav class="lb-fiche__nav" aria-label="Autres domaines">' +
        (opts.prev ? '<a href="' + esc(pageUrl(opts.prev, base, opts.data)) + '"><small>← Au nord</small><span>' + esc(opts.prev.nom) + '</span></a>' : '<span></span>') +
        (opts.next ? '<a class="next" href="' + esc(pageUrl(opts.next, base, opts.data)) + '"><small>Au sud →</small><span>' + esc(opts.next.nom) + '</span></a>' : '<span></span>') +
        '</nav>';
    }
    return '<article class="lb-fiche">' +
      '<div class="wrap">' +
        '<p class="lb-fiche__fil"><a href="' + base + 'index.html#domaines">Les domaines</a> · ' + esc(d.region) + ' · ' + esc(d.village) + '</p>' +
        '<header class="lb-fiche__head">' +
          '<div class="lb-fiche__num">' + pad(d.ordre || 0) + '</div>' +
          '<div><p class="eyebrow">' + esc(d.village) + (d.sousRegion ? ', ' + esc(d.sousRegion) : '') + ' · ' + esc(d.region) + '</p>' +
          '<h1>' + esc(d.nom) + '</h1>' +
          (d.signature ? '<p class="lb-fiche__sig">' + esc(d.signature) + '</p>' : '') + '</div>' +
        '</header>' +
        '<div class="lb-fiche__grid">' +
          '<div class="lb-fiche__media"><img src="' + esc(photoUrl(d, base)) + '" alt="' + esc(d.nom) + '"><p class="lb-fiche__legende">Ambiance de ' + esc(d.village) + '</p></div>' +
          '<div class="lb-fiche__body">' +
            (d.description ? '<p class="lb-modal__desc">' + esc(d.description) + '</p>' : '') +
            renderMeta(d) +
            renderVins(d, { liens: true }) +
            (d.site ? '<a class="lb-modal__site" href="' + esc(d.site) + '" target="_blank" rel="noopener">Site du domaine ↗</a>' : '') +
            '<div class="lb-modal__order"><p>Ces cuvées vous parlent ?</p><a class="lb-btn lb-btn--vin" href="mailto:contact@lesbourguignols.com?subject=' + sujet + '">Demander les disponibilités</a></div>' +
          '</div>' +
        '</div>' +
        nav +
      '</div></article>';
  }

  root.LB_FICHE = { esc: esc, slug: slug, pad: pad, photoUrl: photoUrl, pageUrl: pageUrl, renderMeta: renderMeta, renderVins: renderVins, renderFiche: renderFiche, PLACEHOLDER: PLACEHOLDER };

  /* ---------- Amorce des pages de domaine (navigateur seulement) ---------- */
  if (typeof document === 'undefined') return;
  var main = document.getElementById('lb-fiche');
  if (!main) return;

  var base = document.body.getAttribute('data-base') || '';
  var id = document.body.getAttribute('data-id') || (/[?&]id=([^&]+)/.exec(location.search) || [])[1] || '';
  id = decodeURIComponent(id);

  function charger() {
    var b = root.LB_DATA || { regions: [], domaines: [] };
    try {
      var brut = localStorage.getItem('lb_domaines_v1');
      if (brut) { var p = JSON.parse(brut); if (p && Array.isArray(p.domaines)) return p; }
    } catch (e) { /* base */ }
    return b;
  }
  var data = charger();
  var liste = data.domaines.filter(function (d) { return d.visible !== false; }).sort(function (a, b) { return (a.ordre || 0) - (b.ordre || 0); });
  var i = liste.findIndex(function (d) { return d.id === id; });

  if (i === -1) {
    main.innerHTML = '<div class="wrap lb-fiche__absent"><p class="eyebrow">Fiche introuvable</p><h1>Ce domaine n’est pas (ou plus) au catalogue.</h1><p><a class="lb-btn" href="' + base + 'index.html#domaines">Voir tous les domaines</a></p></div>';
    return;
  }
  var d = liste[i];
  main.innerHTML = renderFiche(d, base, { prev: liste[i - 1], next: liste[i + 1], data: root.LB_DATA });
  document.title = d.nom + ' · ' + d.village + ' : Les Bourguignols';
  if (location.hash && document.querySelector(location.hash)) {
    document.querySelector(location.hash).classList.add('is-cible');
    document.querySelector(location.hash).scrollIntoView({ block: 'center' });
  }

  var nav = document.getElementById('lb-nav'), burger = document.getElementById('lb-burger');
  if (nav && burger) {
    burger.addEventListener('click', function () { var o = nav.classList.toggle('is-open'); burger.setAttribute('aria-expanded', o ? 'true' : 'false'); });
  }
})(typeof module !== 'undefined' && module.exports ? module.exports : window);
