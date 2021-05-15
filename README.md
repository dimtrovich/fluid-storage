# Fluid Storage : v0.1.0

### A  simple and fast client-side structured data storage interface



## A propos

Fluid Storage est un petit systeme qui propose une interface simple et uniforme pour manipuler les données stockés sur le navigateur du l'utilisateur (localStorage, sessionStorage, cookie)

## Prérequis

Aucun

## Installation

Vous pouvez également l'installer via npm

```
npm install fluid-storage
```

## Initialisation

Une fois le l'installation terminée, il ne vous reste plus qu'à utiliser les fonctions disponibles

```js
import fluidStorage from 'fluid-storage';


// Instantiation
let storage = fluidStorage.init('prefixe', 'localstorage');

```

## Utilisation

A ce niveau, vous disposez une interface commune pour lire, écrire ou supprimer les données de votre store

### Ecrire les données

```js
storage.set('userId', 1); // Accepte les nombres
storage.set('token', 'ejHhu.....'); // Accepte les chaines
storage.set('privileges', ['ADD_DATA', 'REMOVE_DATA']); // Accepte les tableau
storage.set('phone', {id: 12, price: '2000 USD', name: 'Iphone 10'}); // Accepte les objets
```

En fonction du type de stockage (*localstorage, sessionstorage, cookie*) défini lors de l'instantiation de l'objet, les données seront stockées soit dans le localStorage, la sessionStorage et les cookies

### Lire les données

```js
console.log(storage.get('userId')); // => 1
console.log(storage.get('token')); // => ejHhu.....
console.log(storage.get('privileges')); // =>['ADD_DATA', 'REMOVE_DATA']
```

### Supprimer les données

```js
storage.remove('userId');
```

### Vider tout le storage

```js
storage.clear();
```



La suite à venir
