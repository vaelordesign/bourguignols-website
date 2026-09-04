/* Qui peut modifier quoi, et comment le changer.
 *
 *   node supabase/acces.js                          voir tous les accès
 *   node supabase/acces.js retirer <courriel> <site>  retirer le droit sur UN site
 *   node supabase/acces.js supprimer <courriel>       supprimer le compte en entier
 *
 * Pour ouvrir un accès : node supabase/creer-acces.js <courriel> <site>
 *
 * Ces commandes exigent la clé secrète, gardée hors dépôt dans
 * C:\Users\charl\OneDrive\Bureau\.vaelor-sites-secrets.txt
 * Qui détient ce fichier décide qui entre. Personne d'autre.
 */
const fs = require('fs');
const FICHIER_SECRETS = 'C:/Users/charl/OneDrive/Bureau/.vaelor-sites-secrets.txt';

const env = {};
fs.readFileSync(FICHIER_SECRETS, 'utf8').split('\n').filter(Boolean)
  .forEach(l => { const i = l.indexOf('='); env[l.slice(0, i)] = l.slice(i + 1).trim(); });

const adm = (chemin, options) => fetch(env.URL + chemin, Object.assign({
  headers: { apikey: env.SECRET, Authorization: 'Bearer ' + env.SECRET, 'Content-Type': 'application/json' }
}, options));

async function comptes() {
  const r = await adm('/auth/v1/admin/users?page=1&per_page=1000');
  return (await r.json()).users || [];
}
async function droits() {
  const r = await adm('/rest/v1/site_editeurs?select=site_id,user_id,ajoute_le');
  return await r.json();
}
async function trouver(courriel) {
  const u = (await comptes()).find(x => (x.email || '').toLowerCase() === courriel.toLowerCase());
  if (!u) { console.error('Aucun compte avec ce courriel : ' + courriel); process.exit(1); }
  return u;
}

const [action, courriel, site] = process.argv.slice(2);

(async () => {
  if (!action || action === 'voir') {
    const [u, d] = [await comptes(), await droits()];
    if (!u.length) { console.log('Aucun compte.'); return; }
    console.log('ACCÈS AU MODULE DE GESTION\n');
    u.forEach(x => {
      const s = d.filter(y => y.user_id === x.id).map(y => y.site_id);
      const vu = x.last_sign_in_at ? new Date(x.last_sign_in_at).toLocaleString('fr-CA') : 'jamais venu';
      console.log('  ' + x.email);
      console.log('     sites   : ' + (s.length ? s.join(', ') : 'AUCUN (ce compte ne sert à rien)'));
      console.log('     dernière visite : ' + vu + '\n');
    });
    console.log(u.length + ' compte(s), ' + d.length + ' droit(s).');
    return;
  }

  if (action === 'retirer') {
    if (!courriel || !site) { console.error('Usage : node supabase/acces.js retirer <courriel> <site>'); process.exit(1); }
    const u = await trouver(courriel);
    const r = await adm('/rest/v1/site_editeurs?user_id=eq.' + u.id + '&site_id=eq.' + encodeURIComponent(site), { method: 'DELETE' });
    if (!r.ok) { console.error('Échec : ' + r.status + ' ' + (await r.text()).slice(0, 140)); process.exit(1); }
    console.log(courriel + ' ne peut plus modifier « ' + site +' ».');
    console.log('Son compte existe toujours : il pourra se connecter, mais ne verra plus ce site.');
    return;
  }

  if (action === 'supprimer') {
    if (!courriel) { console.error('Usage : node supabase/acces.js supprimer <courriel>'); process.exit(1); }
    const u = await trouver(courriel);
    const r = await adm('/auth/v1/admin/users/' + u.id, { method: 'DELETE' });
    if (!r.ok) { console.error('Échec : ' + r.status + ' ' + (await r.text()).slice(0, 140)); process.exit(1); }
    console.log('Compte de ' + courriel + ' supprimé. Ses droits sont partis avec lui.');
    console.log('Sa session ouverte cesse de fonctionner à son prochain rafraîchissement (8 h au plus).');
    return;
  }

  console.error('Action inconnue. Utilisez : voir | retirer | supprimer');
  process.exit(1);
})();
