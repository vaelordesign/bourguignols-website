/* ============================================================
   build-pages.js : fabrique une page par domaine
   Usage : node build-pages.js   (ajouter --hors-ligne pour ignorer la base)
   - lit le contenu publié dans la base en ligne, et met à jour au passage
     js/domaines-data.js, le filet de secours du site
   - écrit domaines/<id>/index.html pour chaque domaine visible
     (adresse : https://vaelordesign.github.io/bourguignols-website/domaines/<id>/)
   - écrit domaine.html (page générique, ?id=..., pour les domaines
     ajoutés dans le module de gestion avant la prochaine construction)
   - supprime les pages des domaines retirés du catalogue
   Utile de le relancer de temps en temps : les pages de domaine gardent alors
   leur texte en dur dans le HTML, ce que Google préfère.
   ============================================================ */
const fs = require('fs');
const path = require('path');

const RACINE = __dirname;
const SITE = 'https://vaelordesign.github.io/bourguignols-website/';

/* Les données viennent de la BASE EN LIGNE (ce que l'agence a publié dans le
   module de gestion). Si elle ne répond pas, on se rabat sur le fichier
   js/domaines-data.js livré avec le site. Après une lecture réussie, ce fichier
   est réécrit : il reste ainsi le filet de secours à jour du site.
   Pour construire sans toucher au réseau : node build-pages.js --hors-ligne */
function duFichier() {
  const w = {};
  new Function('window', fs.readFileSync(path.join(RACINE, 'js/domaines-data.js'), 'utf8'))(w);
  return w.LB_DATA;
}

async function chargerDonnees() {
  if (process.argv.includes('--hors-ligne')) {
    console.log('Données : fichier local (--hors-ligne).');
    return duFichier();
  }
  const cfg = {};
  new Function('window', fs.readFileSync(path.join(RACINE, 'js/config.js'), 'utf8'))(cfg);
  const C = cfg.LB_CONFIG;
  try {
    const r = await fetch(C.url + '/rest/v1/sites?id=eq.' + C.site + '&select=donnees,maj_le',
      { headers: { apikey: C.cle, Authorization: 'Bearer ' + C.cle } });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const rows = await r.json();
    if (!rows.length || !rows[0].donnees || !Array.isArray(rows[0].donnees.domaines)) throw new Error('contenu inutilisable');
    const d = rows[0].donnees;
    delete d.maj_le;
    const entete = '/* LES BOURGUIGNOLS : DONNÉES DU SITE (domaines, cuvées, arrivages)\n' +
      '   Copie du contenu publié en ligne, prise le ' + new Date().toLocaleString('fr-CA') + '.\n' +
      '   Sert de secours quand la base ne répond pas. Ne pas modifier à la main :\n' +
      '   ce fichier est réécrit à chaque « node build-pages.js ». */\n';
    fs.writeFileSync(path.join(RACINE, 'js/domaines-data.js'),
      entete + 'window.LB_DATA = ' + JSON.stringify(d, null, 2) + ';\n', 'utf8');
    console.log('Données : base en ligne (publiée le ' + new Date(rows[0].maj_le).toLocaleString('fr-CA') + '), fichier de secours mis à jour.');
    return d;
  } catch (e) {
    console.log('Données : base injoignable (' + e.message + '), on garde le fichier local.');
    return duFichier();
  }
}

void (async () => {

const DATA = await chargerDonnees();
const { renderFiche, photoUrl, esc } = require('./js/fiche.js').LB_FICHE;
const gabarit = fs.readFileSync(path.join(RACINE, 'templates/domaine.template.html'), 'utf8');

function remplir(vars) {
  return gabarit.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in vars ? vars[k] : m));
}
function attr(s) { return esc(String(s || '').replace(/\s+/g, ' ').trim()); }

const liste = DATA.domaines.filter(d => d.visible !== false).sort((a, b) => (a.ordre || 0) - (b.ordre || 0));
const dossier = path.join(RACINE, 'domaines');
fs.mkdirSync(dossier, { recursive: true });

// Nettoyage des pages de domaines retirés
for (const nom of fs.readdirSync(dossier)) {
  if (!liste.some(d => d.id === nom)) { fs.rmSync(path.join(dossier, nom), { recursive: true, force: true }); console.log('retiré  ', nom); }
}

liste.forEach((d, i) => {
  const base = '../../';
  const desc = (d.signature ? d.signature + ' ' : '') + (d.description || '');
  const html = remplir({
    TITLE: attr(d.nom + ' · ' + d.village + ' : Les Bourguignols'),
    DESC: attr(desc.slice(0, 220)),
    URL: SITE + 'domaines/' + d.id + '/',
    IMAGE: /^(data:|https?:)/.test(d.photo || '') ? '' : SITE + (d.photo || 'images/hero.jpg'),
    BASE: base,
    ID: d.id,
    CONTENT: renderFiche(d, base, { prev: liste[i - 1], next: liste[i + 1], data: DATA })
  });
  fs.mkdirSync(path.join(dossier, d.id), { recursive: true });
  fs.writeFileSync(path.join(dossier, d.id, 'index.html'), html, 'utf8');
});

// Listes d'arrivages en PDF (la liste complète + une par arrivage) et fichiers téléversés
const { LB_PDF } = require('./js/pdf-liste.js');
const dossierArr = path.join(RACINE, 'arrivages');
fs.mkdirSync(dossierArr, { recursive: true });
for (const f of fs.readdirSync(dossierArr)) fs.rmSync(path.join(dossierArr, f), { force: true });
const dateMaj = LB_PDF.dateFr(process.env.LB_DATE || new Date().toISOString().slice(0, 10));
fs.writeFileSync(path.join(dossierArr, 'liste-arrivages.pdf'), Buffer.from(LB_PDF.listeArrivages(DATA, { dateMaj }), 'latin1'));
let nbArr = 0;
for (const a of (DATA.arrivages || []).filter(a => a.visible !== false && a.statut !== 'brouillon')) {
  if (a.fichier && /^data:application\/pdf;base64,/.test(a.fichier)) {
    fs.writeFileSync(path.join(dossierArr, a.id + '.pdf'), Buffer.from(a.fichier.split(',')[1], 'base64'));
  } else {
    fs.writeFileSync(path.join(dossierArr, a.id + '.pdf'), Buffer.from(LB_PDF.listeArrivages(DATA, { ids: [a.id], titre: a.titre, dateMaj }), 'latin1'));
  }
  nbArr++;
}
console.log('PDF : liste-arrivages.pdf + ' + nbArr + ' arrivage(s)');

// Page générique (rendue par le navigateur à partir de ?id=)
fs.writeFileSync(path.join(RACINE, 'domaine.html'), remplir({
  TITLE: 'Fiche de domaine : Les Bourguignols', DESC: 'Fiche d’un domaine représenté par Les Bourguignols, agence d’importation privée à Montréal.',
  URL: SITE + 'domaine.html', IMAGE: SITE + 'images/hero.jpg', BASE: '', ID: '', CONTENT: ''
}), 'utf8');

console.log(liste.length + ' pages de domaine écrites dans domaines/, plus domaine.html');

})();
