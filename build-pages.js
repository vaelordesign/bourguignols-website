/* ============================================================
   build-pages.js : fabrique une page par domaine
   Usage : node build-pages.js
   - lit js/domaines-data.js et templates/domaine.template.html
   - écrit domaines/<id>/index.html pour chaque domaine visible
     (adresse : https://vaelordesign.github.io/bourguignols-website/domaines/<id>/)
   - écrit domaine.html (page générique, ?id=..., pour les domaines
     ajoutés dans le module de gestion avant la prochaine construction)
   - supprime les pages des domaines retirés du fichier de données
   À relancer après chaque nouveau domaines-data.js (export du module
   de gestion), avant de pousser sur GitHub.
   ============================================================ */
const fs = require('fs');
const path = require('path');

const RACINE = __dirname;
const SITE = 'https://vaelordesign.github.io/bourguignols-website/';

const window = {};
new Function('window', fs.readFileSync(path.join(RACINE, 'js/domaines-data.js'), 'utf8'))(window);
const DATA = window.LB_DATA;
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

// Page générique (rendue par le navigateur à partir de ?id=)
fs.writeFileSync(path.join(RACINE, 'domaine.html'), remplir({
  TITLE: 'Fiche de domaine : Les Bourguignols', DESC: 'Fiche d’un domaine représenté par Les Bourguignols, agence d’importation privée à Montréal.',
  URL: SITE + 'domaine.html', IMAGE: SITE + 'images/hero.jpg', BASE: '', ID: '', CONTENT: ''
}), 'utf8');

console.log(liste.length + ' pages de domaine écrites dans domaines/, plus domaine.html');
