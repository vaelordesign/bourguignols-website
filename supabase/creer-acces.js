/* Cree (ou remet a jour) l'acces d'une personne au module de gestion d'un site.
 *
 *   node supabase/creer-acces.js <courriel> <site-id> [mot-de-passe]
 *   ex : node supabase/creer-acces.js vincent@lesbourguignols.com bourguignols
 *
 * Sans mot de passe en argument, il en fabrique un solide et l'affiche.
 * Les inscriptions publiques sont fermees : c'est le SEUL moyen d'ouvrir un acces.
 * La cle secrete est lue dans C:\Users\charl\OneDrive\Bureau\.vaelor-sites-secrets.txt
 * (hors depot, ne jamais la copier ici).
 */
const fs = require('fs');
const FICHIER_SECRETS = 'C:/Users/charl/OneDrive/Bureau/.vaelor-sites-secrets.txt';

const env = {};
fs.readFileSync(FICHIER_SECRETS, 'utf8').split('\n').filter(Boolean)
  .forEach(l => { const i = l.indexOf('='); env[l.slice(0, i)] = l.slice(i + 1).trim(); });

const [courriel, site, mdpArg] = process.argv.slice(2);
if (!courriel || !site) {
  console.error('Usage : node supabase/creer-acces.js <courriel> <site-id> [mot-de-passe]');
  process.exit(1);
}

function motDePasse() {
  const a = 'abcdefghijkmnpqrstuvwxyz', A = 'ABCDEFGHJKLMNPQRSTUVWXYZ', n = '23456789';
  const tout = a + A + n;
  let s = '';
  for (let i = 0; i < 14; i++) s += tout[Math.floor(Math.random() * tout.length)];
  return s;
}
const mdp = mdpArg || motDePasse();

const admin = (chemin, options) => fetch(env.URL + chemin, Object.assign({
  headers: { apikey: env.SECRET, Authorization: 'Bearer ' + env.SECRET, 'Content-Type': 'application/json' }
}, options));

(async () => {
  // 1. le compte existe-t-il deja ?
  let r = await admin('/auth/v1/admin/users?page=1&per_page=1000', { method: 'GET' });
  let liste = await r.json();
  let user = (liste.users || []).find(u => (u.email || '').toLowerCase() === courriel.toLowerCase());

  if (user) {
    r = await admin('/auth/v1/admin/users/' + user.id, {
      method: 'PUT',
      body: JSON.stringify({ password: mdp, email_confirm: true })
    });
    if (!r.ok) { console.error('Echec de la mise a jour :', r.status, await r.text()); process.exit(1); }
    console.log('Compte existant : mot de passe remplace.');
  } else {
    r = await admin('/auth/v1/admin/users', {
      method: 'POST',
      body: JSON.stringify({ email: courriel, password: mdp, email_confirm: true })
    });
    if (!r.ok) { console.error('Echec de la creation :', r.status, await r.text()); process.exit(1); }
    user = await r.json();
    console.log('Compte cree.');
  }

  // 2. le declarer editeur du site
  r = await admin('/rest/v1/site_editeurs', {
    method: 'POST',
    headers: {
      apikey: env.SECRET, Authorization: 'Bearer ' + env.SECRET,
      'Content-Type': 'application/json', Prefer: 'resolution=ignore-duplicates'
    },
    body: JSON.stringify({ site_id: site, user_id: user.id })
  });
  if (!r.ok && r.status !== 409) { console.error('Echec du droit d edition :', r.status, await r.text()); process.exit(1); }

  console.log('');
  console.log('  Adresse du module : https://lesbourguignols.com/gestion.html');
  console.log('  Courriel          : ' + courriel);
  console.log('  Mot de passe      : ' + mdp);
  console.log('  Site gere         : ' + site);
  console.log('');
  console.log('  A transmettre de vive voix ou par un canal sur, pas dans un courriel de masse.');
})();
