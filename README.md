# Fluid Storage : v0.1.3

### A  simple and fast client-side structured data storage interface



## A propos

Fluid Storage est un petit systeme qui propose une interface simple et uniforme pour manipuler les données stockées sur le navigateur du l'utilisateur (localStorage, sessionStorage, cookie)

## Prérequis

Aucun

## Installation

```
// Via NPM
npm install fluid-storage

// Via la balise script
<script src="path/to/fluid-storage/index.js"></script>
```

## Initialisation

Une fois le l'installation terminée, il ne vous reste plus qu'à utiliser les fonctions disponibles

```js
// es6
import fluidStorage from 'fluid-storage';

// Avec utilisation de la balise script
const fluidStorage = window.fluidStorage;


// Instantiation
let storage = fluidStorage.init('prefixe', 'localstorage');

```
La méthode **init** prend 2 paramètres

- **prefix** (*string*) : Considérez le comme le namespace de vos données. Chaque fois que vous enregistrerez unz donnée dans votre store, la clé de cette donnée sera préfixé par ce paramètre. Cela permet d'avoir des clés avec les même clé sans qu'il y ait collision.
- **type** (*string*) : C'est le type de stockage que vous souhaitez utiliser pour gérer votre store. Les valeurs admissible sont: **localstorage**, **sessionstorage**, **cookie**.


## Utilisation

A ce niveau, vous disposez une interface commune pour lire, écrire ou supprimer les données de votre store

### Ecrire les données

```js
storage.set('userId', 1); // Accepte les nombres
storage.set('token', 'ejHhu.....'); // Accepte les chaines
storage.set('privileges', ['ADD_DATA', 'REMOVE_DATA']); // Accepte les tableau
storage.set('phone', {id: 12, price: '2000 USD', name: 'Iphone 10'}); // Accepte les objets
```

En fonction du type de stockage (*localstorage, sessionstorage, cookie*) défini lors de l'instantiation de l'objet, les données seront stockées soit dans le localStorage, la sessionStorage et les cookies.

La méthode **set** prend un troisième paramètre qui permet de définir la durée (en minute) de la donnée dans le store. Si à un instant t, la durée que vous avez définie est expirée, votre donnée sera automatiquement supprimée

```js
storage.set('accessToken', 'ejHhu.....', 2); // Cette donnée sera stockée pendant 2 minutes, après ce temps, la donnée sera supprimée lorsqu'on essayera de la recupérer
```

Dans le cas où vous utiliserez les cookies, ce nombre ne sera pas en minutes mais en jours. Ainsi, le code ci-dessus définira un cookie valable 2 jours.

### Lire les données

```js
console.log(storage.get('userId')); // => 1
console.log(storage.get('token')); // => ejHhu.....
console.log(storage.get('privileges')); // =>['ADD_DATA', 'REMOVE_DATA']
```

### Supprimer les données

```js
storage.remove('userId'); // Supprimer la clé userId du store
storage.remove('userId', 'token'); // Supprimer les clés userId et token du store'
```

### Vider tout le storage

```js
storage.clear();
```



Toutes vos contributions (code, critique ou suggestion) sont les bienvenues. J'espère que ce petit projet poura vous aider
