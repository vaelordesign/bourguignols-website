/* ============================================================
   VAELOR : la bibliothèque de blocs que le client peut ajouter.
   Générique, la même pour tous les sites.

   Un bloc = { id, zone, type, contenu: {...} }
   Chaque type sait se décrire (ses champs) et se rendre (son HTML).
   Le rendu hérite volontairement des polices et des couleurs du site
   (aucune couleur en dur) : un bloc ajouté ne détonne pas.
   ============================================================ */
(function (root) {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  /* le texte riche du client : on n'autorise que la mise en forme, jamais de script */
  function propre(html) {
    var d = document.createElement('div');
    d.innerHTML = String(html || '');
    d.querySelectorAll('script, style, iframe, object, embed, form, input').forEach(function (n) { n.remove(); });
    d.querySelectorAll('*').forEach(function (n) {
      [].slice.call(n.attributes).forEach(function (a) {
        var nom = a.name.toLowerCase();
        if (nom.indexOf('on') === 0) n.removeAttribute(a.name);
        if (nom === 'href' && /^\s*javascript:/i.test(a.value)) n.removeAttribute(a.name);
      });
    });
    return d.innerHTML;
  }

  /* identifiant d'une vidéo YouTube ou Vimeo à partir d'une adresse collée */
  function videoInteg(url) {
    var u = String(url || '');
    var yt = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{6,})/.exec(u);
    if (yt) return 'https://www.youtube-nocookie.com/embed/' + yt[1];
    var vm = /vimeo\.com\/(?:video\/)?(\d+)/.exec(u);
    if (vm) return 'https://player.vimeo.com/video/' + vm[1];
    return '';
  }

  var TYPES = {
    titre: {
      nom: 'Titre', icone: 'T',
      champs: [
        { cle: 'texte', nom: 'Titre', type: 'ligne', defaut: 'Un nouveau titre' },
        { cle: 'niveau', nom: 'Importance', type: 'choix', choix: ['h2', 'h3'], noms: ['Grand', 'Moyen'], defaut: 'h2' }
      ],
      rendre: function (c) {
        var t = c.niveau === 'h3' ? 'h3' : 'h2';
        return '<' + t + ' class="vd-titre" data-ed-champ="texte">' + esc(c.texte) + '</' + t + '>';
      }
    },

    texte: {
      nom: 'Paragraphe', icone: '¶',
      champs: [{ cle: 'html', nom: 'Texte', type: 'riche', defaut: 'Écrivez ici. Vous pouvez mettre des mots en gras, en italique, et poser des liens.' }],
      rendre: function (c) { return '<div class="vd-texte" data-ed-champ="html">' + propre(c.html) + '</div>'; }
    },

    image: {
      nom: 'Image', icone: '▣',
      champs: [
        { cle: 'src', nom: 'Image', type: 'image', defaut: '' },
        { cle: 'legende', nom: 'Légende', type: 'ligne', defaut: '' }
      ],
      rendre: function (c) {
        return '<figure class="vd-image">' +
          (c.src ? '<img src="' + esc(c.src) + '" alt="' + esc(c.legende) + '" loading="lazy">' : '<div class="vd-vide">Choisissez une image</div>') +
          (c.legende ? '<figcaption data-ed-champ="legende">' + esc(c.legende) + '</figcaption>' : '') +
          '</figure>';
      }
    },

    texteImage: {
      nom: 'Texte et image', icone: '▤',
      champs: [
        { cle: 'titre', nom: 'Titre', type: 'ligne', defaut: 'Un titre' },
        { cle: 'html', nom: 'Texte', type: 'riche', defaut: 'Votre texte à côté de l’image.' },
        { cle: 'src', nom: 'Image', type: 'image', defaut: '' },
        { cle: 'cote', nom: 'Image à', type: 'choix', choix: ['droite', 'gauche'], noms: ['Droite', 'Gauche'], defaut: 'droite' }
      ],
      rendre: function (c) {
        var img = '<div class="vd-duo__img">' + (c.src ? '<img src="' + esc(c.src) + '" alt="" loading="lazy">' : '<div class="vd-vide">Image</div>') + '</div>';
        var txt = '<div class="vd-duo__txt">' + (c.titre ? '<h3 class="vd-titre" data-ed-champ="titre">' + esc(c.titre) + '</h3>' : '') +
          '<div data-ed-champ="html">' + propre(c.html) + '</div></div>';
        return '<div class="vd-duo' + (c.cote === 'gauche' ? ' vd-duo--inverse' : '') + '">' + (c.cote === 'gauche' ? img + txt : txt + img) + '</div>';
      }
    },

    galerie: {
      nom: 'Galerie de photos', icone: '⊞',
      champs: [
        { cle: 'images', nom: 'Photos', type: 'images', defaut: [] },
        { cle: 'colonnes', nom: 'Photos par ligne', type: 'nombre', min: 2, max: 5, defaut: 3 }
      ],
      rendre: function (c) {
        var l = (c.images || []);
        if (!l.length) return '<div class="vd-vide">Ajoutez des photos</div>';
        return '<div class="vd-galerie" style="--vd-cols:' + (c.colonnes || 3) + '">' +
          l.map(function (u) { return '<img src="' + esc(u) + '" alt="" loading="lazy">'; }).join('') + '</div>';
      }
    },

    citation: {
      nom: 'Citation', icone: '❝',
      champs: [
        { cle: 'texte', nom: 'Citation', type: 'riche', defaut: 'Une phrase qui marque.' },
        { cle: 'auteur', nom: 'Signée par', type: 'ligne', defaut: '' }
      ],
      rendre: function (c) {
        return '<blockquote class="vd-citation"><div data-ed-champ="texte">' + propre(c.texte) + '</div>' +
          (c.auteur ? '<cite data-ed-champ="auteur">' + esc(c.auteur) + '</cite>' : '') + '</blockquote>';
      }
    },

    bouton: {
      nom: 'Bouton', icone: '▭',
      champs: [
        { cle: 'texte', nom: 'Texte du bouton', type: 'ligne', defaut: 'Nous écrire' },
        { cle: 'lien', nom: 'Adresse', type: 'ligne', defaut: '#contact' },
        { cle: 'style', nom: 'Allure', type: 'choix', choix: ['plein', 'contour'], noms: ['Plein', 'Contour'], defaut: 'plein' }
      ],
      rendre: function (c) {
        return '<p class="vd-boutonwrap"><a class="vd-bouton vd-bouton--' + esc(c.style || 'plein') + '" href="' + esc(c.lien || '#') + '" data-ed-champ="texte">' + esc(c.texte) + '</a></p>';
      }
    },

    liste: {
      nom: 'Liste (horaires, prix…)', icone: '☰',
      champs: [
        { cle: 'titre', nom: 'Titre', type: 'ligne', defaut: '' },
        { cle: 'lignes', nom: 'Lignes', type: 'lignes', defaut: [{ gauche: 'Lundi au vendredi', droite: '9 h à 17 h' }] }
      ],
      rendre: function (c) {
        var l = (c.lignes || []);
        return '<div class="vd-liste">' + (c.titre ? '<h3 class="vd-titre" data-ed-champ="titre">' + esc(c.titre) + '</h3>' : '') +
          '<dl>' + l.map(function (r) {
            return '<div class="vd-liste__l"><dt>' + esc(r.gauche) + '</dt><dd>' + esc(r.droite) + '</dd></div>';
          }).join('') + '</dl></div>';
      }
    },

    encadre: {
      nom: 'Encadré', icone: '▢',
      champs: [
        { cle: 'titre', nom: 'Titre', type: 'ligne', defaut: 'À noter' },
        { cle: 'html', nom: 'Texte', type: 'riche', defaut: 'Une information à mettre en évidence.' }
      ],
      rendre: function (c) {
        return '<aside class="vd-encadre">' + (c.titre ? '<h3 class="vd-titre" data-ed-champ="titre">' + esc(c.titre) + '</h3>' : '') +
          '<div data-ed-champ="html">' + propre(c.html) + '</div></aside>';
      }
    },

    video: {
      nom: 'Vidéo', icone: '▶',
      champs: [{ cle: 'url', nom: 'Adresse YouTube ou Vimeo', type: 'ligne', defaut: '' }],
      rendre: function (c) {
        var u = videoInteg(c.url);
        if (!u) return '<div class="vd-vide">Collez l’adresse d’une vidéo YouTube ou Vimeo</div>';
        return '<div class="vd-video"><iframe src="' + esc(u) + '" title="Vidéo" loading="lazy" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>';
      }
    },

    separateur: {
      nom: 'Séparateur', icone: '—',
      champs: [{ cle: 'style', nom: 'Trait', type: 'choix', choix: ['simple', 'double', 'espace'], noms: ['Simple', 'Double', 'Espace vide'], defaut: 'simple' }],
      rendre: function (c) { return '<div class="vd-sep vd-sep--' + esc(c.style || 'simple') + '"></div>'; }
    }
  };

  /* ---------- Fabriquer l'élément d'un bloc ---------- */
  function rendre(bloc) {
    var t = TYPES[bloc.type];
    if (!t) return null;
    var section = document.createElement('section');
    section.className = 'vd-bloc vd-bloc--' + bloc.type;
    section.setAttribute('data-ed-bloc', bloc.id);
    section.setAttribute('data-ed-nom', t.nom);
    section.setAttribute('data-ed-ajoute', '1');
    section.innerHTML = '<div class="vd-bloc__in">' + t.rendre(bloc.contenu || {}) + '</div>';
    if (root.VAELOR_CONTENU && bloc.styles) root.VAELOR_CONTENU.styleSur(section, bloc.styles);
    return section;
  }

  function contenuParDefaut(type) {
    var t = TYPES[type], c = {};
    if (!t) return c;
    t.champs.forEach(function (ch) {
      c[ch.cle] = Array.isArray(ch.defaut) ? ch.defaut.slice() : ch.defaut;
    });
    return c;
  }

  root.VAELOR_BLOCS = { TYPES: TYPES, rendre: rendre, contenuParDefaut: contenuParDefaut, propre: propre, esc: esc };
})(window);
