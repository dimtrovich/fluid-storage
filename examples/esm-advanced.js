import { init } from '../dist/index.esm.js';

const storage = init('advancedApp');

// Exemples avancés
console.log('=== Advanced Usage Examples ===');

// 1. remember - Récupère ou calcule et stocke
const heavyData = storage.remember('heavyData', () => {
    console.log('Computing heavy data...');
    return { computed: Date.now(), items: Array(1000).fill('data') };
});
console.log('Heavy data:', heavyData);

// 2. pull - Récupère et supprime
const pulled = storage.pull('user');
console.log('Pulled user:', pulled);
console.log('User still exists:', storage.has('user'));

// 3. tap - Modifie une valeur existante
storage.set('counter', 5);
storage.tap('counter', val => val + 10);
console.log('Tapped counter:', storage.get('counter'));

// 4. only/except - Filtrage
storage.set('temp1', 'value1');
storage.set('temp2', 'value2');
storage.set('temp3', 'value3');

console.log('Only temp1 and temp3:', storage.only('temp1', 'temp3'));
console.log('Except temp2:', storage.except('temp2'));

// 5. Gestion d'expiration
storage.set('temporary', 'will expire', 1); // 1 minute
console.log('Expire time:', storage.getExpire('temporary'), 'minutes remaining');

// Nettoyage
storage.remove('temp1', 'temp2', 'temp3');
