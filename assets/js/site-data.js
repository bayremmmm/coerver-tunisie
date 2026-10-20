/* ============================================================
   COERVER® TUNISIE — Contenu modifiable du site
   Remplissez les listes ci-dessous : chaque bloc apparaît
   automatiquement sur le site dès qu'il contient des données.
   Laissez vide ([] ou null) pour masquer le bloc.
   ============================================================ */
window.COERVER_DATA = window.COERVER_DATA || {

  /* Chiffres clés (Accueil) — ex. { valeur: 120, suffixe: '+', label: 'Joueurs inscrits' } */
  chiffres: [],

  /* Planning de la semaine (Programmes)
     ex. { jour: 'Lundi', creneaux: [ { heure: '17:00 – 18:30', groupe: 'Mini Coerver® U6–U8', programme: 'mini' } ] }
     programme : 'mini' | 'performance' | 'advanced' | 'elite' */
  semaine: [],

  /* Histoire de progression (Accueil) — avec l'accord des parents
     ex. { prenom: 'Adam', avant: { age: 8, photo: 'assets/images/...' }, apres: { age: 11, photo: 'assets/images/...' }, texte: '...' } */
  progression: null,

  /* Partenaires (Accueil) — ex. { nom: 'Adidas', logo: 'assets/images/partenaires/adidas.png', lien: 'https://...' } */
  partenaires: [],

  /* Actualités (Accueil, les 3 plus récentes)
     ex. { date: '2026-10-01', titre: '...', texte: '...', photo: 'assets/images/...', lien: 'medias.html' } */
  actualites: [],

  /* Compte à rebours (bandeau Accueil) — affiché seulement si la date est dans le futur
     ex. { titre: 'Summer Camp 2027', date: '2027-07-05T09:00', bouton: 'Me prévenir' } */
  evenement: null
};
