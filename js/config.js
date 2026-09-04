/* Coordonnées de la base en ligne.
   La clé ci-dessous est la clé PUBLIQUE (publishable) : elle est faite pour être
   lue par tout le monde. Elle ne donne que la lecture ; écrire exige une connexion.
   La clé secrète n'est jamais dans ce dossier. */
window.LB_CONFIG = {
  url:  'https://mumqsvwiiqynhhxluade.supabase.co',
  cle:  'sb_publishable_EtRyFIKVhm6GKAZoAdh2Ng_84acEvNb',
  site: 'bourguignols',
  attenteMax: 1500,  // millisecondes : au-delà, on affiche la version livrée avec le site

  /* Vrai tant que le site est une démonstration de vente : l'écran de connexion
     propose alors « Regarder sans se connecter », pratique pour montrer le module
     à un prospect. À passer à false le jour de la livraison : sur un site en
     service, personne n'a à fouiller l'interface de gestion sans compte. */
  demo: true
};
