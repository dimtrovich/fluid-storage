import { init } from '../dist/index.esm.js';

// Initialisation avec localStorage
const storage = init('myApp', 'localstorage', 60);

// Stockage de données
storage.set('user', { name: 'John Doe', age: 30 });
storage.set('settings', { theme: 'dark', language: 'fr' }, 1440); // 24 heures

// Récupération de données
console.log('User:', storage.get('user'));
console.log('Settings:', storage.get('settings'));

// Méthodes utilitaires
storage.increment('visits');
console.log('Visits:', storage.get('visits'));

// Vérification d'existence
console.log('Has user:', storage.has('user'));
console.log('Has token:', storage.has('token'));

// Récupération multiple
const multiple = storage.many(['user', 'settings', 'token']);
console.log('Multiple values:', multiple);

// Nettoyage
// storage.clear(); // Décommentez pour nettoyer
