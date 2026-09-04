/* ============================================================
   VAELOR : application des retouches du client sur un site.
   Fichier LÉGER, chargé par le site public. Il ne sait qu'une chose :
   prendre les retouches enregistrées et les poser sur la page.
   L'éditeur, lui, est un gros fichier chargé seulement en mode édition.

   Rien ici n'est propre à un client : ce fichier est le même pour tous
   les sites de Vaelor.

   ---------------------------------------------------------------
   COMMENT ON REND UN SITE MODIFIABLE
   On pose des étiquettes dans le HTML, rien de plus :

     <h1 data-ed="accueil-titre">Une agence née d'un manque</h1>
     <img data-ed="accueil-photo" src="images/vigne.jpg">
     <section data-ed-bloc="arrivages" data-ed-nom="Prochains arrivages">
     <div data-ed-zone="corps">   (endroit où le client peut ajouter des blocs)

   - data-ed       : contenu modifiable (texte, image, lien)
   - data-ed-bloc  : section entière (cachable, déplaçable, supprimable)
   - data-ed-nom   : le nom lisible affiché au client
   - data-ed-zone  : conteneur où de nouveaux blocs peuvent être ajoutés
   - data-ed-fige  : sur un bloc, interdit de le supprimer ou le déplacer
   ---------------------------------------------------------------

   FORME DES RETOUCHES (dans la base, sous donnees.contenu) :
   {
     "pages": {
       "index.html": {
         "textes":  { "accueil-titre": "Le nouveau titre" },
         "images":  { "accueil-photo": "https://.../nouvelle.jpg" },
         "liens":   { "bouton-commander": "https://..." },
         "styles":  { "accueil-titre": { "taille": 1.2, "couleur": "#5c1d2e" } },
         "caches":  ["arrivages"],
         "ordre":   { "corps": ["une", "domaines", "arrivages"] },
         "ajouts":  [ { "id": "b7", "zone": "corps", "type": "texte", "contenu": {...} } ]
       }
     }
   }
   ============================================================ */
(function (root) {
  'use strict';

  /* ---------- Quelle page sommes-nous ? ---------- */
  function pageActuelle() {
    var p = location.pathname.replace(/\/+$/, '');
    var f = p.split('/').pop() || 'index.html';
    if (f.indexOf('.') === -1) f = 'index.html';
    /* les pages de domaine partagent un même gabarit : elles comptent pour une */
    if (/\/domaines\//.test(location.pathname)) return 'domaine';
    return f;
  }

  /* ---------- Les réglages de style qu'on autorise ----------
     Chacun est borné : le client ajuste, il ne casse pas. */
  var REGLAGES = {
    taille:     { css: '--ed-echelle', min: 0.6,  max: 2,   pas: 0.05, defaut: 1,  nom: 'Taille',        unite: '×' },
    couleur:    { css: 'color',        type: 'couleur',                            nom: 'Couleur du texte' },
    fond:       { css: 'background-color', type: 'couleur',                        nom: 'Couleur de fond' },
    hautMarge:  { css: 'padding-top',  min: 0,    max: 160, pas: 4,    defaut: null, nom: 'Espace au-dessus', unite: 'px' },
    basMarge:   { css: 'padding-bottom', min: 0,  max: 160, pas: 4,    defaut: null, nom: 'Espace en dessous', unite: 'px' },
    alignement: { css: 'text-align',   type: 'choix', choix: ['left', 'center', 'right'], noms: ['Gauche', 'Centré', 'Droite'], nom: 'Alignement' },
    largeur:    { css: 'max-width',    min: 200,  max: 1400, pas: 20,  defaut: null, nom: 'Largeur maximale', unite: 'px' },
    arrondi:    { css: 'border-radius', min: 0,   max: 40,  pas: 2,    defaut: null, nom: 'Coins arrondis', unite: 'px' }
  };

  /* ---------- Appliquer ---------- */
  function styleSur(el, reglages) {
    if (!reglages) return;
    Object.keys(reglages).forEach(function (k) {
      var r = REGLAGES[k];
      var v = reglages[k];
      if (!r || v === null || v === undefined || v === '') return;
      if (k === 'taille') {
        /* l'échelle agit sur la taille de police, sans casser la mise en page */
        var base = parseFloat(getComputedStyle(el).fontSize) || 16;
        if (!el.hasAttribute('data-ed-taille-base')) el.setAttribute('data-ed-taille-base', base);
        el.style.fontSize = (parseFloat(el.getAttribute('data-ed-taille-base')) * v) + 'px';
        return;
      }
      if (r.type === 'couleur' || r.type === 'choix') { el.style.setProperty(r.css, v); return; }
      el.style.setProperty(r.css, v + 'px');
    });
  }

  function appliquer(contenu) {
    if (!contenu || !contenu.pages) return;
    var p = contenu.pages[pageActuelle()];
    if (!p) return;

    /* 1. les textes */
    if (p.textes) Object.keys(p.textes).forEach(function (cle) {
      document.querySelectorAll('[data-ed="' + CSS.escape(cle) + '"]').forEach(function (el) {
        if (el.tagName === 'IMG') return;
        el.innerHTML = p.textes[cle];
      });
    });

    /* 2. les images */
    if (p.images) Object.keys(p.images).forEach(function (cle) {
      document.querySelectorAll('[data-ed="' + CSS.escape(cle) + '"]').forEach(function (el) {
        var url = p.images[cle];
        if (el.tagName === 'IMG') { el.src = url; el.removeAttribute('srcset'); }
        else el.style.backgroundImage = 'url("' + url + '")';
      });
    });

    /* 3. les liens */
    if (p.liens) Object.keys(p.liens).forEach(function (cle) {
      document.querySelectorAll('a[data-ed="' + CSS.escape(cle) + '"]').forEach(function (el) {
        el.href = p.liens[cle];
      });
    });

    /* 4. les styles */
    if (p.styles) Object.keys(p.styles).forEach(function (cle) {
      document.querySelectorAll('[data-ed="' + CSS.escape(cle) + '"], [data-ed-bloc="' + CSS.escape(cle) + '"]').forEach(function (el) {
        styleSur(el, p.styles[cle]);
      });
    });

    /* 5. les sections cachées */
    (p.caches || []).forEach(function (id) {
      document.querySelectorAll('[data-ed-bloc="' + CSS.escape(id) + '"]').forEach(function (el) {
        el.setAttribute('data-ed-cache', '1');
        if (!root.VAELOR_EDITION) el.style.display = 'none';
      });
    });

    /* 6. l'ordre des sections dans une zone */
    if (p.ordre) Object.keys(p.ordre).forEach(function (zone) {
      var conteneur = document.querySelector('[data-ed-zone="' + CSS.escape(zone) + '"]');
      if (!conteneur) return;
      p.ordre[zone].forEach(function (id) {
        var el = conteneur.querySelector(':scope > [data-ed-bloc="' + CSS.escape(id) + '"]');
        if (el) conteneur.appendChild(el);      // remet dans l'ordre voulu
      });
    });

    /* 7. les blocs ajoutés par le client */
    (p.ajouts || []).forEach(function (bloc) {
      var conteneur = document.querySelector('[data-ed-zone="' + CSS.escape(bloc.zone) + '"]');
      if (!conteneur || conteneur.querySelector('[data-ed-bloc="' + CSS.escape(bloc.id) + '"]')) return;
      var el = root.VAELOR_BLOCS ? root.VAELOR_BLOCS.rendre(bloc) : null;
      if (el) conteneur.appendChild(el);
    });
  }

  root.VAELOR_CONTENU = { appliquer: appliquer, pageActuelle: pageActuelle, REGLAGES: REGLAGES, styleSur: styleSur };
})(window);
