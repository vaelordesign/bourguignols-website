/* ============================================================
   VAELOR : l'éditeur visuel. Un mini Elementor maison.

   Le client ouvre son propre site avec ?edition à la fin de l'adresse.
   Il voit son site tel quel, et il peut cliquer dessus pour le changer :
   un texte se tape, une photo se remplace, une section se cache, se
   déplace ou se supprime, un bloc s'ajoute.

   Ce fichier n'est chargé QUE en mode édition : le visiteur ordinaire
   ne télécharge rien de tout ça.

   Il ne connaît aucun client en particulier : c'est le même éditeur
   pour tous les sites de Vaelor.
   ============================================================ */
(function (root) {
  'use strict';

  var N = root.LB_NUAGE;
  var C = root.VAELOR_CONTENU;
  var B = root.VAELOR_BLOCS;
  var PAGE = C.pageActuelle();

  var etat = {
    donnees: null,      // le document complet du site (catalogue + contenu)
    retouches: null,    // le raccourci vers contenu.pages[PAGE]
    sale: false,
    selection: null,    // l'élément choisi
    historique: [],
    enCours: false
  };

  /* ---------- Petits outils ---------- */
  function el(html) { var d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
  function copie(o) { return JSON.parse(JSON.stringify(o)); }

  function page() {
    var c = etat.donnees.contenu || (etat.donnees.contenu = {});
    var p = c.pages || (c.pages = {});
    return p[PAGE] || (p[PAGE] = { textes: {}, images: {}, liens: {}, styles: {}, caches: [], ordre: {}, ajouts: [] });
  }

  function marquer() {
    etat.sale = true;
    var b = $('#vd-etat');
    if (b) { b.textContent = 'Non publié'; b.className = 'vd-etat vd-etat--sale'; }
    $('#vd-publier').disabled = false;
  }

  function memoriser() {
    etat.historique.push(copie(etat.donnees.contenu || {}));
    if (etat.historique.length > 40) etat.historique.shift();
    $('#vd-annuler').disabled = false;
  }

  function toast(msg, duree) {
    var t = $('#vd-toast');
    t.textContent = msg; t.hidden = false;
    clearTimeout(toast.t);
    toast.t = setTimeout(function () { t.hidden = true; }, duree || 2600);
  }

  /* ============================================================
     LA BARRE DU HAUT
     ============================================================ */
  function barre() {
    var b = el(
      '<div class="vd-barre" id="vd-barre">' +
        '<span class="vd-barre__marque">Édition</span>' +
        '<span class="vd-etat" id="vd-etat">Tout est publié</span>' +
        '<span class="vd-barre__espace"></span>' +
        '<button type="button" class="vd-b" id="vd-annuler" disabled>↶ Annuler</button>' +
        '<button type="button" class="vd-b" id="vd-ajouter">+ Ajouter un bloc</button>' +
        '<button type="button" class="vd-b vd-b--vert" id="vd-apercu">Aperçu</button>' +
        '<button type="button" class="vd-b vd-b--plein" id="vd-publier" disabled>Publier</button>' +
        '<button type="button" class="vd-b" id="vd-quitter">Quitter</button>' +
      '</div>');
    document.body.appendChild(b);
    document.body.classList.add('vd-edition');

    $('#vd-publier').addEventListener('click', publier);
    $('#vd-quitter').addEventListener('click', quitter);
    $('#vd-annuler').addEventListener('click', annuler);
    $('#vd-ajouter').addEventListener('click', function () { choisirBloc(null); });
    $('#vd-apercu').addEventListener('click', function () {
      document.body.classList.toggle('vd-apercu');
      var on = document.body.classList.contains('vd-apercu');
      this.textContent = on ? 'Revenir à l’édition' : 'Aperçu';
      if (on) deselectionner();
    });

    document.body.appendChild(el('<div class="vd-toast" id="vd-toast" hidden></div>'));
    document.body.appendChild(el('<aside class="vd-panneau" id="vd-panneau" hidden></aside>'));
  }

  /* ============================================================
     REPÉRER CE QUI EST MODIFIABLE
     ============================================================ */
  function preparer() {
    /* les contenus : textes, images, liens */
    $$('[data-ed]').forEach(function (n) {
      n.classList.add('vd-cible');
      n.setAttribute('tabindex', '0');
    });

    /* les blocs : sections entières */
    $$('[data-ed-bloc]').forEach(function (n) {
      n.classList.add('vd-blocmod');
      if (!$('.vd-etiquette', n)) {
        var nom = n.getAttribute('data-ed-nom') || 'Section';
        var etq = el('<div class="vd-etiquette"><span>' + B.esc(nom) + '</span></div>');
        n.appendChild(etq);
      }
      if (n.hasAttribute('data-ed-cache')) n.classList.add('vd-est-cache');
    });

    /* les zones : là où on peut ajouter */
    $$('[data-ed-zone]').forEach(function (z) {
      z.classList.add('vd-zone');
      if (!$(':scope > .vd-ajout', z)) {
        var nomZone = z.getAttribute('data-ed-zone');
        var bouton = el('<button type="button" class="vd-ajout">+ Ajouter un bloc ici</button>');
        bouton.addEventListener('click', function (e) { e.stopPropagation(); choisirBloc(nomZone); });
        z.appendChild(bouton);
      }
    });

    document.addEventListener('click', surClic, true);
  }

  function surClic(e) {
    if (document.body.classList.contains('vd-apercu')) return;
    if (e.target.closest('.vd-barre, .vd-panneau, .vd-modale, .vd-toast, .vd-ajout, .vd-format')) return;

    var cible = e.target.closest('[data-ed]');
    var bloc = e.target.closest('[data-ed-bloc]');

    if (cible) {
      e.preventDefault(); e.stopPropagation();
      selectionner(cible);
      return;
    }
    if (bloc) {
      e.preventDefault(); e.stopPropagation();
      selectionner(bloc);
      return;
    }
    /* en édition, les liens ne naviguent pas : on ne veut pas perdre son travail */
    var lien = e.target.closest('a[href]');
    if (lien && !lien.closest('.vd-barre')) { e.preventDefault(); }
  }

  /* ============================================================
     SÉLECTION ET PANNEAU DE RÉGLAGES
     ============================================================ */
  function deselectionner() {
    if (etat.selection) {
      etat.selection.classList.remove('vd-choisi');
      finirTexte(etat.selection);
    }
    etat.selection = null;
    var p = $('#vd-panneau'); p.hidden = true; p.innerHTML = '';
  }

  function selectionner(n) {
    if (etat.selection === n) return;
    deselectionner();
    etat.selection = n;
    n.classList.add('vd-choisi');
    panneauPour(n);
    degager(n);
  }

  /* Sur un écran étroit le panneau occupe le bas : on remonte la page pour
     que ce qu'on modifie reste sous les yeux. */
  function degager(n) {
    if (innerWidth > 900) return;
    setTimeout(function () {
      var p = $('#vd-panneau');
      var hautDuPanneau = p.hidden ? innerHeight : p.getBoundingClientRect().top;
      var r = n.getBoundingClientRect();
      if (r.top >= 62 && r.bottom <= hautDuPanneau - 8) return;   // déjà visible
      var voulu = 62 + Math.max(0, (hautDuPanneau - 62 - Math.min(r.height, 200)) / 2);
      scrollBy({ top: r.top - voulu, behavior: 'smooth' });
    }, 60);
  }

  function cleDe(n) {
    return n.getAttribute('data-ed') || n.getAttribute('data-ed-bloc');
  }

  function panneauPour(n) {
    var p = $('#vd-panneau');
    var estBloc = n.hasAttribute('data-ed-bloc');
    var estImage = n.tagName === 'IMG' || (n.hasAttribute('data-ed') && /image|photo|fond/i.test(cleDe(n)) && n.tagName !== 'A');
    var estLien = n.tagName === 'A' && n.hasAttribute('data-ed');
    var nom = n.getAttribute('data-ed-nom') || (estBloc ? 'Section' : estImage ? 'Image' : 'Texte');

    var html = '<header class="vd-panneau__t"><b>' + B.esc(nom) + '</b>' +
      '<button type="button" class="vd-x" id="vd-fermer" aria-label="Fermer">×</button></header><div class="vd-panneau__c">';

    if (estBloc) html += outilsDeBloc(n);
    if (estImage) html += '<button type="button" class="vd-b vd-b--plein vd-b--large" id="vd-changer-image">Remplacer la photo</button>';
    if (estLien) {
      html += '<label class="vd-champ">Adresse du lien<input type="text" id="vd-lien" value="' + B.esc(n.getAttribute('href') || '') + '"></label>';
    }
    if (!estBloc && !estImage) {
      html += '<p class="vd-aide">Cliquez dans le texte pour l’écrire. Sélectionnez des mots pour les mettre en gras ou en italique.</p>';
    }

    /* un bloc ajouté par le client : ses propres champs */
    var ajout = blocAjoute(n);
    if (ajout) html += champsDuBloc(ajout);

    html += reglagesHtml(n, estBloc);
    html += '</div>';

    p.innerHTML = html;
    p.hidden = false;

    $('#vd-fermer').addEventListener('click', deselectionner);
    var bi = $('#vd-changer-image'); if (bi) bi.addEventListener('click', function () { remplacerImage(n); });
    var bl = $('#vd-lien'); if (bl) bl.addEventListener('change', function () {
      memoriser(); page().liens[cleDe(n)] = this.value; n.setAttribute('href', this.value); marquer();
    });

    brancherReglages(n);
    if (ajout) brancherChamps(n, ajout);
    if (!estBloc && !estImage) commencerTexte(n);
  }

  function blocAjoute(n) {
    if (!n.hasAttribute('data-ed-ajoute')) return null;
    var id = n.getAttribute('data-ed-bloc');
    return (page().ajouts || []).find(function (b) { return b.id === id; }) || null;
  }

  /* ---------- Boutons propres à une section ---------- */
  function outilsDeBloc(n) {
    var fige = n.hasAttribute('data-ed-fige');
    var cache = n.classList.contains('vd-est-cache');
    var ajoute = n.hasAttribute('data-ed-ajoute');
    return '<div class="vd-outils">' +
      (fige ? '' : '<button type="button" class="vd-b" data-a="monter">↑ Monter</button>' +
                   '<button type="button" class="vd-b" data-a="descendre">↓ Descendre</button>') +
      '<button type="button" class="vd-b" data-a="cacher">' + (cache ? '👁 Réafficher' : '🚫 Cacher') + '</button>' +
      (ajoute ? '<button type="button" class="vd-b vd-b--rouge" data-a="supprimer">Supprimer</button>' : '') +
      '</div>';
  }

  /* ---------- Réglages de style ---------- */
  function reglagesHtml(n, estBloc) {
    var cle = cleDe(n);
    var actuels = (page().styles || {})[cle] || {};
    var liste = estBloc
      ? ['fond', 'hautMarge', 'basMarge', 'alignement']
      : ['taille', 'couleur', 'alignement', 'largeur'];
    if (n.tagName === 'IMG') liste = ['largeur', 'arrondi', 'alignement'];

    var h = '<div class="vd-reglages"><h4>Apparence</h4>';
    liste.forEach(function (k) {
      var r = C.REGLAGES[k];
      var v = actuels[k];
      if (r.type === 'couleur') {
        h += '<label class="vd-champ vd-champ--coul">' + r.nom +
          '<span><input type="color" data-r="' + k + '" value="' + (v || '#000000') + '">' +
          '<button type="button" class="vd-mini" data-raz="' + k + '">Défaut</button></span></label>';
      } else if (r.type === 'choix') {
        h += '<label class="vd-champ">' + r.nom + '<select data-r="' + k + '"><option value="">Par défaut</option>' +
          r.choix.map(function (c, i) { return '<option value="' + c + '"' + (v === c ? ' selected' : '') + '>' + r.noms[i] + '</option>'; }).join('') +
          '</select></label>';
      } else {
        var val = (v === undefined || v === null) ? '' : v;
        h += '<label class="vd-champ vd-champ--curseur">' + r.nom +
          '<span><input type="range" data-r="' + k + '" min="' + r.min + '" max="' + r.max + '" step="' + r.pas + '" value="' + (val === '' ? (r.defaut === null ? r.min : r.defaut) : val) + '">' +
          '<output>' + (val === '' ? 'auto' : val + ' ' + (r.unite || '')) + '</output>' +
          '<button type="button" class="vd-mini" data-raz="' + k + '">Défaut</button></span></label>';
      }
    });
    return h + '</div>';
  }

  function brancherReglages(n) {
    var cle = cleDe(n);
    var p = $('#vd-panneau');

    $$('[data-a]', p).forEach(function (b) {
      b.addEventListener('click', function () { actionBloc(n, b.getAttribute('data-a')); });
    });

    $$('[data-r]', p).forEach(function (inp) {
      var k = inp.getAttribute('data-r');
      var evt = inp.type === 'range' ? 'input' : 'change';
      inp.addEventListener(evt, function () {
        var s = page().styles[cle] || (page().styles[cle] = {});
        s[k] = inp.type === 'range' ? parseFloat(inp.value) : inp.value;
        if (inp.value === '') delete s[k];
        var out = inp.parentElement.querySelector('output');
        if (out) out.textContent = inp.value + ' ' + (C.REGLAGES[k].unite || '');
        appliquerUn(n, cle);
        marquer();
      });
      if (inp.type === 'range') inp.addEventListener('change', memoriser);
    });

    $$('[data-raz]', p).forEach(function (b) {
      b.addEventListener('click', function () {
        memoriser();
        var k = b.getAttribute('data-raz');
        var s = page().styles[cle];
        if (s) { delete s[k]; if (!Object.keys(s).length) delete page().styles[cle]; }
        n.removeAttribute('style');
        appliquerUn(n, cle);
        marquer();
        panneauPour(n);
      });
    });
  }

  function appliquerUn(n, cle) {
    n.removeAttribute('style');
    C.styleSur(n, (page().styles || {})[cle]);
  }

  function actionBloc(n, quoi) {
    memoriser();
    var id = n.getAttribute('data-ed-bloc');
    var zone = n.closest('[data-ed-zone]');
    var p = page();

    if (quoi === 'cacher') {
      p.caches = p.caches || [];
      var i = p.caches.indexOf(id);
      if (i === -1) { p.caches.push(id); n.classList.add('vd-est-cache'); }
      else { p.caches.splice(i, 1); n.classList.remove('vd-est-cache'); }
      marquer(); panneauPour(n);
      return;
    }

    if (quoi === 'supprimer') {
      if (!confirm('Supprimer ce bloc ?')) return;
      p.ajouts = (p.ajouts || []).filter(function (b) { return b.id !== id; });
      n.remove(); deselectionner(); marquer();
      return;
    }

    if (quoi === 'monter' || quoi === 'descendre') {
      if (!zone) { toast('Cette section ne peut pas être déplacée.'); return; }
      var freres = $$(':scope > [data-ed-bloc]', zone);
      var pos = freres.indexOf(n);
      var cible = quoi === 'monter' ? pos - 1 : pos + 1;
      if (cible < 0 || cible >= freres.length) { toast('Déjà tout en ' + (quoi === 'monter' ? 'haut' : 'bas') + '.'); return; }
      if (quoi === 'monter') zone.insertBefore(n, freres[cible]);
      else zone.insertBefore(freres[cible], n);
      var nomZone = zone.getAttribute('data-ed-zone');
      p.ordre = p.ordre || {};
      p.ordre[nomZone] = $$(':scope > [data-ed-bloc]', zone).map(function (x) { return x.getAttribute('data-ed-bloc'); });
      marquer();
      n.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }

  /* ============================================================
     ÉCRIRE DANS LE TEXTE
     ============================================================ */
  var barreFormat = null;

  function commencerTexte(n) {
    if (n.tagName === 'IMG') return;
    n.setAttribute('contenteditable', 'true');
    n.classList.add('vd-ecrit');
    n.focus();
    n.addEventListener('input', surFrappe);
    n.addEventListener('keydown', surTouche);
    document.addEventListener('selectionchange', surSelection);
  }

  function finirTexte(n) {
    if (!n || !n.hasAttribute || !n.hasAttribute('contenteditable')) return;
    n.removeAttribute('contenteditable');
    n.classList.remove('vd-ecrit');
    n.removeEventListener('input', surFrappe);
    n.removeEventListener('keydown', surTouche);
    document.removeEventListener('selectionchange', surSelection);
    cacherFormat();
  }

  var minuterieFrappe = null;
  function surFrappe(e) {
    var n = e.currentTarget;
    clearTimeout(minuterieFrappe);
    minuterieFrappe = setTimeout(memoriser, 900);
    var cle = cleDe(n);
    var ajout = blocAjoute(n.closest('[data-ed-bloc]') || n);
    var champ = n.closest('[data-ed-champ]');
    if (ajout && champ) {
      ajout.contenu[champ.getAttribute('data-ed-champ')] = champ.innerHTML;
    } else {
      page().textes[cle] = n.innerHTML;
    }
    marquer();
  }

  function surTouche(e) {
    if (e.key === 'Escape') { e.preventDefault(); deselectionner(); return; }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); publier(); }
  }

  function surSelection() {
    var s = document.getSelection();
    if (!s || s.isCollapsed || !etat.selection || !etat.selection.contains(s.anchorNode)) { cacherFormat(); return; }
    montrerFormat(s.getRangeAt(0).getBoundingClientRect());
  }

  function montrerFormat(r) {
    if (!barreFormat) {
      barreFormat = el('<div class="vd-format">' +
        '<button type="button" data-f="bold"><b>G</b></button>' +
        '<button type="button" data-f="italic"><i>I</i></button>' +
        '<button type="button" data-f="lien">🔗</button>' +
        '<button type="button" data-f="removeFormat">✕</button></div>');
      document.body.appendChild(barreFormat);
      $$('button', barreFormat).forEach(function (b) {
        b.addEventListener('mousedown', function (e) { e.preventDefault(); });
        b.addEventListener('click', function () {
          var f = b.getAttribute('data-f');
          if (f === 'lien') {
            var u = prompt('Adresse du lien (laisser vide pour retirer) :', '');
            if (u === null) return;
            document.execCommand(u ? 'createLink' : 'unlink', false, u || undefined);
          } else {
            document.execCommand(f, false, null);
          }
          if (etat.selection) etat.selection.dispatchEvent(new Event('input', { bubbles: false }));
        });
      });
    }
    barreFormat.hidden = false;
    barreFormat.style.top = (r.top + scrollY - 46) + 'px';
    barreFormat.style.left = (r.left + scrollX + r.width / 2) + 'px';
  }
  function cacherFormat() { if (barreFormat) barreFormat.hidden = true; }

  /* ============================================================
     LES IMAGES
     ============================================================ */
  function remplacerImage(n) {
    var inp = el('<input type="file" accept="image/*" hidden>');
    document.body.appendChild(inp);
    inp.addEventListener('change', function () {
      var f = inp.files[0];
      inp.remove();
      if (!f) return;
      toast('Préparation de la photo…', 8000);
      reduire(f, 1600, function (blob) {
        if (!blob) { toast('Cette image n’a pas pu être lue.'); return; }
        var nom = 'pages/' + PAGE.replace(/\W+/g, '-') + '-' + (cleDe(n) || 'image') + '-' + Date.now() + '.jpg';
        N.televerser(blob, nom).then(function (url) {
          memoriser();
          var champ = n.closest('[data-ed-champ]');
          var ajout = blocAjoute(n.closest('[data-ed-bloc]') || n);
          if (ajout) {
            ajout.contenu[champ ? champ.getAttribute('data-ed-champ') : 'src'] = url;
            redessinerAjout(ajout);
          } else {
            page().images[cleDe(n)] = url;
            if (n.tagName === 'IMG') { n.src = url; n.removeAttribute('srcset'); }
            else n.style.backgroundImage = 'url("' + url + '")';
          }
          marquer();
          toast('Photo remplacée. Pensez à publier.');
        }).catch(function (e) { toast(e.message || 'L’envoi a échoué.'); });
      });
    });
    inp.click();
  }

  function reduire(fichier, maxLarge, suite) {
    var r = new FileReader();
    r.onload = function () {
      var img = new Image();
      img.onload = function () {
        var w = Math.min(maxLarge, img.width), h = Math.round(img.height * w / img.width);
        var c = document.createElement('canvas'); c.width = w; c.height = h;
        c.getContext('2d').drawImage(img, 0, 0, w, h);
        c.toBlob(suite, 'image/jpeg', 0.84);
      };
      img.onerror = function () { suite(null); };
      img.src = r.result;
    };
    r.onerror = function () { suite(null); };
    r.readAsDataURL(fichier);
  }

  /* ============================================================
     AJOUTER UN BLOC
     ============================================================ */
  function choisirBloc(zoneVoulue) {
    var zones = $$('[data-ed-zone]');
    if (!zones.length) { toast('Cette page n’a pas encore d’endroit prévu pour ajouter des blocs.'); return; }
    var zone = zoneVoulue || zones[0].getAttribute('data-ed-zone');

    var liste = Object.keys(B.TYPES).map(function (t) {
      return '<button type="button" class="vd-carte" data-t="' + t + '">' +
        '<span class="vd-carte__i">' + B.TYPES[t].icone + '</span>' + B.esc(B.TYPES[t].nom) + '</button>';
    }).join('');

    var m = el('<div class="vd-modale"><div class="vd-modale__b"><header><b>Ajouter un bloc</b>' +
      '<button type="button" class="vd-x" data-fermer>×</button></header>' +
      '<div class="vd-cartes">' + liste + '</div></div></div>');
    document.body.appendChild(m);
    m.addEventListener('click', function (e) {
      if (e.target === m || e.target.hasAttribute('data-fermer')) m.remove();
      var c = e.target.closest('[data-t]');
      if (!c) return;
      m.remove();
      poserBloc(c.getAttribute('data-t'), zone);
    });
  }

  function poserBloc(type, zone) {
    memoriser();
    var bloc = {
      id: 'b' + Date.now().toString(36),
      zone: zone,
      type: type,
      contenu: B.contenuParDefaut(type)
    };
    var p = page();
    p.ajouts = p.ajouts || [];
    p.ajouts.push(bloc);

    var conteneur = $('[data-ed-zone="' + CSS.escape(zone) + '"]');
    var node = B.rendre(bloc);
    var boutonAjout = $(':scope > .vd-ajout', conteneur);
    conteneur.insertBefore(node, boutonAjout || null);
    preparer();
    marquer();
    node.scrollIntoView({ block: 'center', behavior: 'smooth' });
    selectionner(node);
  }

  function redessinerAjout(bloc) {
    var ancien = $('[data-ed-bloc="' + CSS.escape(bloc.id) + '"]');
    if (!ancien) return;
    var neuf = B.rendre(bloc);
    ancien.replaceWith(neuf);
    preparer();
    selectionner(neuf);
  }

  /* ---------- Les champs d'un bloc ajouté ---------- */
  function champsDuBloc(bloc) {
    var t = B.TYPES[bloc.type];
    var h = '<div class="vd-reglages"><h4>Contenu</h4>';
    t.champs.forEach(function (ch) {
      var v = bloc.contenu[ch.cle];
      if (ch.type === 'ligne') {
        h += '<label class="vd-champ">' + ch.nom + '<input type="text" data-c="' + ch.cle + '" value="' + B.esc(v || '') + '"></label>';
      } else if (ch.type === 'nombre') {
        h += '<label class="vd-champ">' + ch.nom + '<input type="number" data-c="' + ch.cle + '" min="' + ch.min + '" max="' + ch.max + '" value="' + (v || ch.defaut) + '"></label>';
      } else if (ch.type === 'choix') {
        h += '<label class="vd-champ">' + ch.nom + '<select data-c="' + ch.cle + '">' +
          ch.choix.map(function (o, i) { return '<option value="' + o + '"' + (v === o ? ' selected' : '') + '>' + ch.noms[i] + '</option>'; }).join('') + '</select></label>';
      } else if (ch.type === 'image') {
        h += '<button type="button" class="vd-b vd-b--large" data-img="' + ch.cle + '">' + (v ? 'Changer' : 'Choisir') + ' : ' + ch.nom + '</button>';
      } else if (ch.type === 'images') {
        h += '<button type="button" class="vd-b vd-b--large" data-imgs="' + ch.cle + '">Ajouter des photos (' + ((v || []).length) + ')</button>';
      } else if (ch.type === 'lignes') {
        h += '<div class="vd-lignes" data-lignes="' + ch.cle + '">' +
          (v || []).map(function (r, i) {
            return '<div class="vd-ligne"><input type="text" data-l="' + i + '" data-p="gauche" value="' + B.esc(r.gauche) + '" placeholder="Libellé">' +
              '<input type="text" data-l="' + i + '" data-p="droite" value="' + B.esc(r.droite) + '" placeholder="Valeur">' +
              '<button type="button" class="vd-mini" data-suppr="' + i + '">×</button></div>';
          }).join('') + '<button type="button" class="vd-b" data-ajout-ligne="1">+ Une ligne</button></div>';
      } else if (ch.type === 'riche') {
        h += '<p class="vd-aide">« ' + ch.nom + ' » se modifie directement dans la page.</p>';
      }
    });
    return h + '</div>';
  }

  function brancherChamps(n, bloc) {
    var p = $('#vd-panneau');

    $$('[data-c]', p).forEach(function (inp) {
      inp.addEventListener('change', function () {
        memoriser();
        bloc.contenu[inp.getAttribute('data-c')] = inp.type === 'number' ? parseInt(inp.value, 10) : inp.value;
        redessinerAjout(bloc); marquer();
      });
    });

    $$('[data-img]', p).forEach(function (b) {
      b.addEventListener('click', function () {
        var cle = b.getAttribute('data-img');
        choisirFichier(function (blob, nomFichier) {
          N.televerser(blob, 'pages/bloc-' + bloc.id + '-' + Date.now() + '.jpg').then(function (url) {
            memoriser(); bloc.contenu[cle] = url; redessinerAjout(bloc); marquer(); toast('Photo ajoutée.');
          }).catch(function (e) { toast(e.message); });
        });
      });
    });

    $$('[data-imgs]', p).forEach(function (b) {
      b.addEventListener('click', function () {
        var cle = b.getAttribute('data-imgs');
        choisirFichier(function (blob) {
          N.televerser(blob, 'pages/galerie-' + bloc.id + '-' + Date.now() + '.jpg').then(function (url) {
            memoriser();
            bloc.contenu[cle] = (bloc.contenu[cle] || []).concat([url]);
            redessinerAjout(bloc); marquer(); toast('Photo ajoutée à la galerie.');
          }).catch(function (e) { toast(e.message); });
        }, true);
      });
    });

    var zoneL = $('[data-lignes]', p);
    if (zoneL) {
      var cle = zoneL.getAttribute('data-lignes');
      zoneL.addEventListener('change', function (e) {
        var i = e.target.getAttribute('data-l');
        if (i === null) return;
        memoriser();
        bloc.contenu[cle][parseInt(i, 10)][e.target.getAttribute('data-p')] = e.target.value;
        redessinerAjout(bloc); marquer();
      });
      zoneL.addEventListener('click', function (e) {
        if (e.target.hasAttribute('data-ajout-ligne')) {
          memoriser();
          bloc.contenu[cle] = (bloc.contenu[cle] || []).concat([{ gauche: '', droite: '' }]);
          redessinerAjout(bloc); marquer();
        }
        var s = e.target.getAttribute('data-suppr');
        if (s !== null) {
          memoriser();
          bloc.contenu[cle].splice(parseInt(s, 10), 1);
          redessinerAjout(bloc); marquer();
        }
      });
    }
  }

  function choisirFichier(suite, multiple) {
    var inp = el('<input type="file" accept="image/*" hidden' + (multiple ? ' multiple' : '') + '>');
    document.body.appendChild(inp);
    inp.addEventListener('change', function () {
      var fs = [].slice.call(inp.files); inp.remove();
      fs.forEach(function (f) { reduire(f, 1600, function (b) { if (b) suite(b, f.name); }); });
    });
    inp.click();
  }

  /* ============================================================
     ANNULER, PUBLIER, QUITTER
     ============================================================ */
  function annuler() {
    if (!etat.historique.length) return;
    etat.donnees.contenu = etat.historique.pop();
    $('#vd-annuler').disabled = !etat.historique.length;
    marquer();
    rafraichir();
  }

  function rafraichir() {
    /* on recharge la page en gardant les retouches en mémoire : le plus sûr */
    sessionStorage.setItem('vd_brouillon', JSON.stringify(etat.donnees.contenu));
    location.reload();
  }

  function publier() {
    if (etat.enCours) return;
    etat.enCours = true;
    var b = $('#vd-publier'); b.disabled = true; b.textContent = 'Publication…';
    N.lire().then(function (frais) {
      frais.contenu = etat.donnees.contenu;      // on ne touche qu'au contenu
      return N.ecrire(frais).then(function () { etat.donnees = frais; });
    }).then(function () {
      etat.sale = false;
      sessionStorage.removeItem('vd_brouillon');
      var s = $('#vd-etat'); s.textContent = 'Tout est publié'; s.className = 'vd-etat';
      b.textContent = 'Publier';
      toast('Publié. Vos visiteurs voient les changements.');
    }).catch(function (e) {
      b.disabled = false; b.textContent = 'Publier';
      toast(e.message || 'La publication a échoué.', 5000);
    }).then(function () { etat.enCours = false; });
  }

  function quitter() {
    if (etat.sale && !confirm('Des changements ne sont pas publiés. Ils seront perdus. Quitter quand même ?')) return;
    sessionStorage.removeItem('vd_brouillon');
    location.href = location.pathname;
  }

  /* ============================================================
     DÉMARRAGE
     ============================================================ */
  function demarrer() {
    if (!N || !N.session()) {
      var base = document.body.getAttribute('data-base') || '';
      var bloque = false;
      try { localStorage.setItem('vd_essai', '1'); localStorage.removeItem('vd_essai'); }
      catch (e) { bloque = true; }
      document.body.appendChild(el(
        '<div class="vd-porte"><p><b>Cette page sert à modifier le site.</b></p>' +
        (bloque
          ? '<p>Votre navigateur refuse de retenir la connexion : navigation privée, ou protection contre le pistage. Ouvrez le site dans une fenêtre normale, ou autorisez les données de site pour cette adresse.</p>'
          : '<p>Connectez-vous d’abord : c’est le même mot de passe que pour la gestion du catalogue.</p>') +
        '<p><a class="vd-b vd-b--plein" href="' + base + 'gestion.html">Se connecter</a></p>' +
        '<p><a class="vd-b" href="' + location.pathname + '">Revenir au site</a></p></div>'));
      return;
    }
    N.pret().then(function () { return N.lire(); }).then(function (d) {
      etat.donnees = d;
      var brouillon = sessionStorage.getItem('vd_brouillon');
      if (brouillon) {
        try { etat.donnees.contenu = JSON.parse(brouillon); } catch (e) { /* tant pis */ }
      }
      root.VAELOR_EDITION = true;
      C.appliquer(etat.donnees.contenu);
      barre();
      preparer();
      if (brouillon) { marquer(); toast('Vos changements en cours ont été retrouvés.'); }
      window.addEventListener('beforeunload', function (e) {
        if (etat.sale) { e.preventDefault(); e.returnValue = ''; }
      });
    }).catch(function (e) {
      alert('Impossible de charger le contenu du site : ' + (e.message || e));
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', demarrer);
  else demarrer();
})(window);
