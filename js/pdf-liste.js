/* ============================================================
   LES BOURGUIGNOLS : liste des arrivages en PDF
   Générateur de PDF maison, sans dépendance (lettre US, Helvetica).
   Fonctionne dans le navigateur (bouton Télécharger, toujours à
   jour avec le module de gestion) et dans Node (build-pages.js,
   qui produit arrivages/liste-arrivages.pdf et arrivages/<id>.pdf).
   ============================================================ */
(function (root) {
  'use strict';

  var PAGE_W = 612, PAGE_H = 792, MARGE = 54, LARGEUR = PAGE_W - 2 * MARGE;
  var VIN = '0.36 0.11 0.18', ENCRE = '0.12 0.10 0.09', GRIS = '0.49 0.45 0.42', FILET = '0.78 0.74 0.68', PAPIER = '0.93 0.90 0.84';
  var MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

  /* ---------- Texte : encodage WinAnsi et largeur approximative ---------- */
  var SPECIAUX = { '’': 0x92, '‘': 0x91, '“': 0x93, '”': 0x94, '–': 0x96, '—': 0x97, '…': 0x85, '€': 0x80, 'œ': 0x9C, 'Œ': 0x8C, '•': 0x95, ' ': 0x20 };
  function winansi(s) {
    var out = '';
    s = String(s == null ? '' : s).replace(/[\r\n\t]+/g, ' ');
    for (var i = 0; i < s.length; i++) {
      var c = s.charCodeAt(i), ch = s[i];
      if (SPECIAUX[ch] !== undefined) c = SPECIAUX[ch];
      else if (c > 255) c = 63;
      var b = String.fromCharCode(c);
      if (b === '\\' || b === '(' || b === ')') out += '\\' + b; else out += b;
    }
    return out;
  }
  function largeurChar(ch) {
    if (/[ilj.,:;'!|]/.test(ch)) return 0.28;
    if (/[ftrI\-\[\]\(\)]/.test(ch)) return 0.34;
    if (/[mwMW]/.test(ch)) return 0.85;
    if (/[A-ZÀ-ÖØ-Þ]/.test(ch)) return 0.68;
    if (/[0-9]/.test(ch)) return 0.556;
    if (ch === ' ') return 0.278;
    return 0.55;
  }
  function largeur(s, taille) {
    var w = 0; s = String(s || '');
    for (var i = 0; i < s.length; i++) w += largeurChar(s[i]);
    return w * taille;
  }
  function couper(s, taille, maxW) {
    var mots = String(s || '').split(/\s+/).filter(Boolean), lignes = [], cur = '';
    mots.forEach(function (m) {
      var essai = cur ? cur + ' ' + m : m;
      if (largeur(essai, taille) <= maxW || !cur) cur = essai;
      else { lignes.push(cur); cur = m; }
    });
    if (cur) lignes.push(cur);
    return lignes.length ? lignes : [''];
  }
  function dateFr(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || '');
    if (!m) return iso || '';
    return parseInt(m[3], 10) + ' ' + MOIS[parseInt(m[2], 10) - 1] + ' ' + m[1];
  }

  /* ---------- Document ---------- */
  function Doc() {
    this.pages = []; this.ops = null; this.y = 0;
    this.nouvellePage();
  }
  Doc.prototype.nouvellePage = function () { this.ops = []; this.pages.push(this.ops); this.y = PAGE_H - MARGE; };
  Doc.prototype.assurer = function (h) { if (this.y - h < MARGE + 30) this.nouvellePage(); };
  Doc.prototype.texte = function (s, x, y, taille, police, couleur) {
    this.ops.push('BT ' + (couleur || ENCRE) + ' rg /' + (police || 'F1') + ' ' + taille + ' Tf ' + x.toFixed(1) + ' ' + y.toFixed(1) + ' Td (' + winansi(s) + ') Tj ET');
  };
  Doc.prototype.texteDroite = function (s, xDroite, y, taille, police, couleur) { this.texte(s, xDroite - largeur(s, taille), y, taille, police, couleur); };
  Doc.prototype.ligne = function (x1, y1, x2, y2, couleur, epaisseur) {
    this.ops.push((couleur || FILET) + ' RG ' + (epaisseur || 0.5) + ' w ' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' m ' + x2.toFixed(1) + ' ' + y2.toFixed(1) + ' l S');
  };
  Doc.prototype.rect = function (x, y, w, h, couleur) { this.ops.push(couleur + ' rg ' + x.toFixed(1) + ' ' + y.toFixed(1) + ' ' + w.toFixed(1) + ' ' + h.toFixed(1) + ' re f'); };
  Doc.prototype.paragraphe = function (s, x, maxW, taille, police, couleur, interligne) {
    var self = this, lignes = couper(s, taille, maxW), il = interligne || taille * 1.35;
    lignes.forEach(function (l) { self.assurer(il); self.y -= il; self.texte(l, x, self.y, taille, police, couleur); });
  };

  function entete(doc, sousTitre) {
    doc.texte('LES BOURGUIGNOLS', MARGE, doc.y - 8, 9, 'F2', VIN);
    doc.texteDroite(sousTitre, PAGE_W - MARGE, doc.y - 8, 8, 'F1', GRIS);
    doc.ligne(MARGE, doc.y - 16, PAGE_W - MARGE, doc.y - 16, ENCRE, 0.8);
    doc.ligne(MARGE, doc.y - 18.5, PAGE_W - MARGE, doc.y - 18.5, ENCRE, 0.4);
    doc.y -= 40;
  }

  function tableau(doc, lignes, domaines) {
    var cols = [
      { t: 'Domaine', x: MARGE, w: 150 },
      { t: 'Cuvée', x: MARGE + 158, w: 176 },
      { t: 'Format', x: MARGE + 342, w: 66 },
      { t: 'Quantité', x: MARGE + 414, w: 60 },
      { t: 'Prix', x: MARGE + 480, w: LARGEUR - 480 }
    ];
    doc.assurer(30);
    doc.y -= 14;
    cols.forEach(function (c) { doc.texte(c.t.toUpperCase(), c.x, doc.y, 7, 'F2', GRIS); });
    doc.y -= 5;
    doc.ligne(MARGE, doc.y, PAGE_W - MARGE, doc.y, ENCRE, 0.6);
    lignes.forEach(function (l) {
      var d = l.domaineId && domaines ? domaines.find(function (x) { return x.id === l.domaineId; }) : null;
      var nomDom = d ? d.nom : (l.domaine || '');
      var cuvee = (l.cuvee || '') + (l.millesime ? ' ' + l.millesime : '');
      var cells = [couper(nomDom, 9.5, cols[0].w), couper(cuvee, 9.5, cols[1].w), couper(l.format || '', 9, cols[2].w), couper(l.quantite || '', 9, cols[3].w), couper(l.prix || '', 9, cols[4].w)];
      var n = Math.max.apply(null, cells.map(function (c) { return c.length; }));
      var h = n * 12 + 8 + (l.note ? 11 : 0);
      doc.assurer(h);
      var yTop = doc.y;
      cells.forEach(function (c, i) {
        c.forEach(function (t, k) { doc.texte(t, cols[i].x, yTop - 12 - k * 12, i < 2 ? 9.5 : 9, i === 0 ? 'F2' : 'F1', i === 0 ? ENCRE : (i === 3 ? VIN : ENCRE)); });
      });
      doc.y = yTop - n * 12 - 6;
      if (l.note) { doc.texte(l.note, cols[1].x, doc.y - 3, 8, 'F3', GRIS); doc.y -= 11; }
      doc.y -= 2;
      doc.ligne(MARGE, doc.y, PAGE_W - MARGE, doc.y, FILET, 0.4);
    });
  }

  function bloc(doc, a, domaines) {
    var passe = a.statut !== 'a-venir';
    doc.assurer(70);
    doc.y -= 26;
    doc.texte(a.titre || 'Arrivage', MARGE, doc.y, 15, 'F2', VIN);
    doc.y -= 15;
    var quand = (passe ? 'Arrivé' : 'Arrivée prévue') + (a.dateTexte ? ' : ' + a.dateTexte : (a.date ? ' : ' + dateFr(a.date) : ''));
    doc.texte(quand + (passe ? '' : ' · Réservations ouvertes'), MARGE, doc.y, 9.5, 'F3', GRIS);
    doc.y -= 4;
    if (a.texte) { doc.paragraphe(a.texte, MARGE, LARGEUR, 9.5, 'F1', ENCRE, 13); }
    if ((a.lignes || []).length) tableau(doc, a.lignes, domaines); else { doc.y -= 14; doc.texte('Liste des vins à venir.', MARGE, doc.y, 9.5, 'F3', GRIS); }
    doc.y -= 6;
  }

  function fabriquer(doc) {
    var n = doc.pages.length, objets = [], pageIds = [];
    var add = function (s) { objets.push(s); return objets.length; };
    add('<< /Type /Catalog /Pages 2 0 R >>');
    add('PAGES');
    add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
    add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
    add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique /Encoding /WinAnsiEncoding >>');
    doc.pages.forEach(function (ops, i) {
      var pied = 'BT ' + GRIS + ' rg /F1 7.5 Tf ' + MARGE + ' ' + (MARGE - 16) + ' Td (' + winansi('Les Bourguignols inc. · Montréal · contact@lesbourguignols.com · lesbourguignols.com') + ') Tj ET' +
        ' BT ' + GRIS + ' rg /F1 7.5 Tf ' + (PAGE_W - MARGE - largeur('Page ' + (i + 1) + ' / ' + n, 7.5)).toFixed(1) + ' ' + (MARGE - 16) + ' Td (' + winansi('Page ' + (i + 1) + ' / ' + n) + ') Tj ET' +
        ' ' + FILET + ' RG 0.4 w ' + MARGE + ' ' + (MARGE - 6) + ' m ' + (PAGE_W - MARGE) + ' ' + (MARGE - 6) + ' l S';
      var flux = ops.join('\n') + '\n' + pied;
      var contenu = add('<< /Length ' + flux.length + ' >>\nstream\n' + flux + '\nendstream');
      pageIds.push(add('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + PAGE_W + ' ' + PAGE_H + '] /Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R >> >> /Contents ' + contenu + ' 0 R >>'));
    });
    objets[1] = '<< /Type /Pages /Kids [' + pageIds.map(function (id) { return id + ' 0 R'; }).join(' ') + '] /Count ' + n + ' >>';
    var out = '%PDF-1.4\n%âãÏÓ\n', offsets = [];
    objets.forEach(function (o, i) { offsets.push(out.length); out += (i + 1) + ' 0 obj\n' + o + '\nendobj\n'; });
    var xref = out.length;
    out += 'xref\n0 ' + (objets.length + 1) + '\n0000000000 65535 f \n';
    offsets.forEach(function (o) { out += ('0000000000' + o).slice(-10) + ' 00000 n \n'; });
    out += 'trailer\n<< /Size ' + (objets.length + 1) + ' /Root 1 0 R >>\nstartxref\n' + xref + '\n%%EOF\n';
    return out; // chaîne binaire : un caractère = un octet
  }

  /* ---------- API ---------- */
  /* data : { domaines, arrivages } ; opts : { ids: [..] pour n'en garder que certains, titre, dateMaj } */
  function listeArrivages(data, opts) {
    opts = opts || {};
    var domaines = data.domaines || [];
    var arr = (data.arrivages || []).filter(function (a) { return a.visible !== false && a.statut !== 'brouillon' && (!opts.ids || opts.ids.indexOf(a.id) !== -1); });
    var aVenir = arr.filter(function (a) { return a.statut === 'a-venir'; }).sort(function (a, b) { return String(a.date || '').localeCompare(String(b.date || '')); });
    var passes = arr.filter(function (a) { return a.statut !== 'a-venir'; }).sort(function (a, b) { return String(b.date || '').localeCompare(String(a.date || '')); });
    var doc = new Doc();
    entete(doc, 'Agence d’importation privée · Montréal');
    doc.y -= 4;
    doc.texte(opts.titre || 'Liste des arrivages', MARGE, doc.y, 24, 'F2', ENCRE);
    doc.y -= 16;
    doc.texte('Mise à jour le ' + (opts.dateMaj || dateFr(new Date().toISOString().slice(0, 10))), MARGE, doc.y, 9.5, 'F3', GRIS);
    doc.y -= 18;
    doc.rect(MARGE, doc.y - 24, LARGEUR, 30, PAPIER);
    doc.texte('Réservations par courriel à contact@lesbourguignols.com. La commande se fait à la caisse ; elle arrive dans la', MARGE + 10, doc.y - 8, 8.5, 'F1', ENCRE);
    doc.texte('succursale SAQ de votre choix, où vous la réglez au moment de la cueillette. Quantités et prix confirmés par retour de courriel.', MARGE + 10, doc.y - 19, 8.5, 'F1', ENCRE);
    doc.y -= 30;
    if (!aVenir.length && !passes.length) { doc.y -= 30; doc.texte('Aucun arrivage annoncé pour le moment. Écrivez-nous pour être prévenu du prochain.', MARGE, doc.y, 11, 'F3', GRIS); }
    if (aVenir.length && !opts.ids) {
      doc.y -= 28;
      doc.texte('CALENDRIER', MARGE, doc.y, 8, 'F2', GRIS);
      aVenir.forEach(function (a) {
        doc.y -= 15;
        doc.texte(a.dateTexte || dateFr(a.date), MARGE, doc.y, 10, 'F2', VIN);
        doc.texte(a.titre || '', MARGE + 170, doc.y, 10, 'F1', ENCRE);
        doc.texteDroite((a.lignes || []).length + (a.lignes && a.lignes.length > 1 ? ' vins' : ' vin'), PAGE_W - MARGE, doc.y, 9, 'F3', GRIS);
      });
      doc.y -= 6;
      doc.ligne(MARGE, doc.y, PAGE_W - MARGE, doc.y, ENCRE, 0.6);
    }
    aVenir.forEach(function (a) { bloc(doc, a, domaines); });
    if (passes.length && !opts.ids) {
      doc.assurer(40); doc.y -= 30;
      doc.texte('ARRIVAGES PRÉCÉDENTS', MARGE, doc.y, 8, 'F2', GRIS);
      doc.texte('Quelques bouteilles restent parfois en entrepôt : demandez-nous.', MARGE + 130, doc.y, 8, 'F3', GRIS);
    }
    passes.forEach(function (a) { bloc(doc, a, domaines); });
    return fabriquer(doc);
  }

  function nomFichier(a) {
    var s = String(a && a.titre || 'liste-arrivages').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return 'bourguignols-' + (s || 'arrivage') + '.pdf';
  }

  /* Navigateur : déclenche le téléchargement */
  function telecharger(nom, bin) {
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i) & 255;
    var blob = new Blob([bytes], { type: 'application/pdf' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = nom;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 3000);
  }

  root.LB_PDF = { listeArrivages: listeArrivages, telecharger: telecharger, nomFichier: nomFichier, dateFr: dateFr };
})(typeof module !== 'undefined' && module.exports ? module.exports : window);
