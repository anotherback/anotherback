# anotherback

[![CI](https://github.com/buttons/github-buttons/workflows/build/badge.svg)](https://github.com/anotherback/anotherback)
[![NPM version](https://img.shields.io/npm/v/anotherback)](https://www.npmjs.com/package/anotherback)

C'est un framework basé sur [`fastify`](https://www.fastify.io) qui vous aide pour la création et l'organisation d'un backend en JavaScript dans l'environnement nodeJS. Il fonctionne avec son client intégré.

**anotherback** crée une arborescence de travail qui vous impose une ligne directive afin de mieux vous organiser.

Il fournit en plus une assistance lors de la création de vos fichiers à partir de template qui sont bien évidemment personnalisables.

Je recommande fortement d'utiliser **toanotherback** pour le front afin de parfaitement bien exploité toutes les fonctionnalités de **anotherback**.

## Prérequis

[nodeJS](https://nodejs.org/en/) en version >= à 18.13.0. _(version sur laquelle le framework est développé)_

## Installation

```
npm install anotherback@latest
```

## Initialisation

_Il est préférable d'intégrer **anotherback** à la création de votre projet._

1. Effectuer la commande :

```
npm init -y
```

2. Puis ouvrez package.json :


```js
{
    //Les paramètres que contient le package.json...

    //Définissez la valeur de "type" sur "module" 
    //pour passer node en mode ESM.
    "type": "module"
    
}
```

3. Enfin, initialiser le projet avec la commande :

```
npx aob
```

Vous devriez normalement avoir une arborescence ressemblant à celle-ci dessous :

```
- > workdir
    - > node_modules
    - > src
        - > access
        - > checker
        - > import
        - > method
        - > register
        - token.js
    - aob.config.js
    - package.json
```