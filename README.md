# Fluid Storage

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![TypeScript](https://img.shields.io/badge/types-TypeScript-007ACC.svg)
![Bundle Size](https://img.shields.io/bundlephobia/minzip/fluid-storage)

**Une interface de stockage structuré de données, simple, rapide et intuitive** ✨

## A propos

Fluid Storage est un petit systeme qui propose une API simple, unifiée et fluide pour gérer le stockage côté client (localStorage, sessionStorage, cookies) avec des fonctionnalités avancées inspirées de Laravel.

## 🌟 Fonctionnalités

- **📦 Multi-backend** - Supporte localStorage, sessionStorage et cookies
- **⚡ Interface fluide** - API chainable et intuitive
- **🕒 Expiration automatique** - Gestion native de l'expiration des données
- **🔧 TypeScript** - Complètement typé pour une meilleure expérience de développement
- **📏 Léger** - Seulement ~8KB gzippé
- **🛡️ Robustesse** - Gestion d'erreurs et fallbacks automatiques
- **🎯 Polyvalent** - Supporte tous les environnements (Node.js, navigateur, modules)

## 📦 Installation

```bash
npm install fluid-storage
```

ou

```bash
yarn add fluid-storage
```

## 🚀 Utilisation rapide

### ES Modules
```javascript
import { init } from 'fluid-storage';

const storage = init('myApp', 'localstorage', 60);

// Stocker des données
storage.set('user', { name: 'John', age: 30 });
storage.set('settings', { theme: 'dark' }, 1440); // Expire dans 24h

storage.set('userId', 1); // Accepte les nombres
storage.set('token', 'ejHhu.....'); // Accepte les chaines
storage.set('permissions', ['ADD_DATA', 'REMOVE_DATA']); // Accepte les tableau
storage.set('phone', {id: 12, price: '2000 USD', name: 'Iphone 10'}); // Accepte les objets

// Récupérer des données
const user = storage.get('user');
const settings = storage.get('settings');

// Méthodes avancées
storage.increment('visits');
storage.remember('cachedData', () => expensiveOperation());
```

### CommonJS
```javascript
const { init } = require('fluid-storage');

const storage = init('myApp');
// Même API que ES Modules
```

### Navigateur (CDN)
```html
<script src="https://unpkg.com/fluid-storage/dist/index.umd.js"></script>
<script>
const storage = fluidStorage.init('myApp');
storage.set('key', 'value');
console.log(storage.get('key'));
</script>
```

## 📖 Documentation complète

### Initialisation

```javascript
const storage = init(prefix?, type?, defaultExpire?);
```

- **prefix** (`string`, optionnel) - Préfixe pour toutes les clés (défaut: `'fs'`)
- **type** (`'localstorage' | 'sessionstorage' | 'cookie' | StorageAdapter`, optionnel) - Type de stockage (défaut: `'localstorage'`)
- **defaultExpire** (`number`, optionnel) - Expiration par défaut en minutes (défaut: `0` - pas d'expiration)

### Méthodes principales

#### Stockage et récupération

```javascript
// Stocker une valeur
storage.set('key', 'value');
storage.set('key', { object: 'value' }, 60); // Expire dans 60 minutes

// Stocker multiple
storage.setMany({
  key1: 'value1',
  key2: 'value2'
}, 120); // Expire dans 120 minutes

// Récupérer une valeur
const value = storage.get('key');

// Récupérer multiple
const values = storage.many(['key1', 'key2', 'key3']);

// Récupérer tout
const allData = storage.getAll();
```

#### Vérification d'existence

```javascript
storage.has('key');          // → boolean
storage.exists('key');       // → boolean
storage.missing('key');      // → boolean
storage.hasAny(['k1', 'k2']);// → boolean
storage.hasAll(['k1', 'k2']);// → boolean
```

#### Opérations sur les données

```javascript
// Incrémentation/Décrémentation
storage.increment('counter');     // +1
storage.increment('counter', 5);  // +5
storage.decrement('counter', 2);  // -2

// Remember (récupère ou calcule)
const data = storage.remember('key', () => {
  return expensiveOperation();
}, 60); // Cache pendant 60 minutes

// Pull (récupère et supprime)
const value = storage.pull('key');

// Tap (modifie une valeur)
storage.tap('key', currentValue => {
  return currentValue + 1;
});
```

#### Filtrage et sélection

```javascript
// Obtenir seulement certaines clés
const filtered = storage.only('key1', 'key2');

// Exclure certaines clés
const without = storage.except('keyToExclude');

// Premier/dernier résultat existant
const first = storage.first(['key1', 'key2', 'key3']);
const last = storage.last(['key1', 'key2', 'key3']);

// Valeur aléatoire
const random = storage.random();      // Une valeur aléatoire
const randomMultiple = storage.random(3); // 3 valeurs aléatoires
```

#### Gestion de l'expiration

```javascript
// Définir l'expiration
storage.expire('key', 30); // Expire dans 30 minutes

// Obtenir le temps restant
const minutesLeft = storage.getExpire('key'); // → number | null

// Étendre/Réduire l'expiration
storage.extend('key', 15);  // Ajoute 15 minutes
storage.reduce('key', 10);  // Retire 10 minutes

// Définir plusieurs expirations
storage.expireMany(['k1', 'k2'], 60);
```

#### Suppression

```javascript
storage.remove('key');          // Supprimer une clé
storage.remove('k1', 'k2');     // Supprimer plusieurs clés
storage.forget('key');          // Alias de remove
storage.clear();                // Tout supprimer
storage.flush();                // Alias de clear
```

### Méthodes utilitaires

```javascript
// Vérification de contenu
storage.isEmpty('key');     // → boolean
storage.isNotEmpty('key');  // → boolean

// Information
storage.count();            // Nombre total d'items
storage.keys();             // Tableau de toutes les clés
storage.values();           // Tableau de toutes les valeurs

// Stockage permanent
storage.forever('key', 'value'); // N'expire jamais

// Ajout conditionnel
storage.add('key', 'value'); // → boolean (true si ajouté, false si existait déjà)
```

## 🎯 Exemples avancés

### Gestion d'utilisateur

```javascript
const userStorage = init('userApp', 'localstorage', 120);

// Connexion utilisateur
userStorage.set('auth', {
  token: 'jwt_token_here',
  user: { id: 1, name: 'John Doe' }
}, 1440); // Expire dans 24h

// Métriques
userStorage.increment('loginCount');
userStorage.set('lastLogin', new Date().toISOString());

// Données temporaires
userStorage.remember('userPreferences', () => {
  return fetchUserPreferences(); // Seulement appelé si non caché
}, 60);
```

### Cache d'API

```javascript
const apiCache = init('apiCache', 'sessionstorage', 10); // 10 minutes par défaut

async function fetchWithCache(url) {
  return apiCache.remember(`api:${url}`, async () => {
    const response = await fetch(url);
    return response.json();
  }, 5); // Cache pour 5 minutes
}
```

### Panier d'achat

```javascript
const cartStorage = init('cart', 'localstorage');

// Ajouter au panier
cartStorage.tap('items', (currentItems = []) => {
  return [...currentItems, { id: 123, quantity: 1 }];
});

// Mettre à jour la quantité
cartStorage.tap('items', items =>
  items.map(item =>
    item.id === 123 ? { ...item, quantity: 2 } : item
  )
);

// Total du panier
const total = cartStorage.get('items')?.reduce((sum, item) =>
  sum + (item.price * item.quantity), 0
);
```

## 🔧 Configuration avancée

### Adaptateur personnalisé

```javascript
import { init, BaseAdapter } from 'fluid-storage';

class CustomAdapter extends BaseAdapter {
  get(key) { /* implémentation */ }
  set(key, value, expire) { /* implémentation */ }
  remove(key) { /* implémentation */ }
  clear() { /* implémentation */ }
  getAll() { /* implémentation */ }
}

const storage = init('myApp', new CustomAdapter('custom-prefix'));
```

### Multiple instances

```javascript
// Stockage principal
const mainStorage = init('app', 'localstorage');

// Stockage de session
const sessionStorage = init('app-session', 'sessionstorage');

// Stockage temporaire
const tempStorage = init('app-temp', 'localstorage', 10); // 10 minutes
```

## 📊 Comparaison des backends

| Fonctionnalité | localStorage | sessionStorage | Cookies |
|----------------|--------------|----------------|---------|
| Persistance | ✅ Permanent | ❌ Session | ✅ Permanent |
| Capacité | ~5-10MB | ~5-10MB | ~4KB |
| Accès serveur | ❌ Non | ❌ Non | ✅ Oui |
| Expiration | Manuel | Session | Automatique |
| Performance | ⚡ Rapide | ⚡ Rapide | 🐢 Lente |

## 🛠️ Développement

### Installation

```bash
git clone https://github.com/dimtrovich/fluid-storage.git
cd fluid-storage
npm install
```

### Build

```bash
npm run build
```

### Tests

```bash
npm test
npm run test:coverage
```

### Structure du projet

```
src/
├── adapters/          # Adaptateurs de stockage
│   ├── base-adapter.ts
│   ├── local-storage.ts
│   ├── session-storage.ts
│   └── cookie-storage.ts
├── types.ts          # Définitions TypeScript
├── storage.ts        # Coeur fonctionnel
├── utils.ts          # Méthodes utilitaires
└── index.ts          Point d'entrée
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. Commit vos changements (`git commit -m 'Add amazing feature'`)
4. Push sur la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📜 License

MIT License - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🐛 Problèmes connus

- Les cookies ont une capacité limitée (~4KB)
- L'expiration des cookies est gérée différemment
- Safari en mode privé bloque localStorage

## 🔮 Roadmap

- [ ] Support IndexedDB
- [ ] Chiffrement des données
- [ ] Synchronisation entre onglets
- [ ] Plugins et middleware
- [ ] Support des observables (RxJS)

## 💡 Bonnes pratiques

1. **Utilisez des préfixes significatifs** pour éviter les collisions
2. **Choisissez le bon backend** selon vos besoins
3. **Gérez les quotas** avec try/catch pour localStorage
4. **Utilisez l'expiration** pour les données temporaires
5. **Validez les données** à la récupération

## 🌐 Compatibilité

- Chrome 4+
- Firefox 3.5+
- Safari 4+
- IE 8+
- Edge 12+
- Node.js 12+

## 📞 Support

- 📧 Email: devcode.dst@gmail.com
- 🐛 [Issues GitHub](https://github.com/dimtrovich/fluid-storage/issues)
- 💬 [Discussions GitHub](https://github.com/dimtrovich/fluid-storage/discussions)

---

**Développé avec ❤️ par [Dimitri Sitchet Tomkeu](https://github.com/dimtrovich)**
