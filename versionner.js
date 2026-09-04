/* ============================================================
   versionner.js : colle un numéro de version aux fichiers js et css
   de toutes les pages HTML du site.

   Pourquoi : GitHub Pages sert ses fichiers avec « Cache-Control: max-age=600 ».
   Après une mise en ligne, le navigateur d'une personne qui a visité le site
   peu avant continue de servir l'ANCIEN code. Elle ne voit pas les nouveautés,
   ou pire, mélange ancien et nouveau, et rien ne l'explique.

   Avec « js/nuage.js?v=2609042212 », changer la version change l'adresse :
   le navigateur est obligé d'aller chercher le fichier neuf.

   Lancé tout seul par build-pages.js. Ou à la main : node versionner.js
   ============================================================ */
const fs = require('fs');
const path = require('path');

const RACINE = __dirname;
const IGNORE = ['node_modules', '.git', 'arrivages'];

/* Version = date et heure de la construction, en minutes. Suffisamment fine
   pour deux mises en ligne le même jour, et lisible : 2609042212 = 4 sept.
   2026, 22 h 12. */
function versionDuJour() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return String(d.getFullYear()).slice(2) + p(d.getMonth() + 1) + p(d.getDate()) + p(d.getHours()) + p(d.getMinutes());
}

function pagesHtml(dossier, trouvees = []) {
  for (const nom of fs.readdirSync(dossier)) {
    if (IGNORE.includes(nom) || nom.startsWith('.')) continue;
    const complet = path.join(dossier, nom);
    const stat = fs.statSync(complet);
    if (stat.isDirectory()) pagesHtml(complet, trouvees);
    else if (nom.endsWith('.html')) trouvees.push(complet);
  }
  return trouvees;
}

function versionner(v) {
  let pages = 0, liens = 0;
  for (const page of pagesHtml(RACINE)) {
    const avant = fs.readFileSync(page, 'utf8');
    /* src="…/xxx.js" ou href="…/xxx.css", avec ou sans ?v=… déjà présent.
       On ne touche pas aux adresses complètes (polices Google, etc.). */
    const apres = avant.replace(
      /(\s(?:src|href)=")((?!https?:|data:|\/\/)[^"]+\.(?:js|css))(\?v=\d+)?(")/g,
      (m, debut, fichier, ancienne, fin) => { liens++; return debut + fichier + '?v=' + v + fin; }
    );
    if (apres !== avant) { fs.writeFileSync(page, apres, 'utf8'); pages++; }
  }
  return { pages, liens };
}

/* Lancé à la main : on agit. Appelé par build-pages.js : on se contente
   d'exporter, c'est lui qui décide du moment. */
if (require.main === module) {
  const v = process.argv[2] || versionDuJour();
  const r = versionner(v);
  console.log('Version ' + v + ' posée sur ' + r.liens + ' fichier(s) dans ' + r.pages + ' page(s).');
}

module.exports = { versionner, versionDuJour };
