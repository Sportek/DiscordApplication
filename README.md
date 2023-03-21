# Super bot discord très complet

Repository d'un bot discord en _discord.js v13_ utilisant discord factory (un framework simplifiant la création de bot discord qui a été modifié par mes soins).

Les différents modules disponibles : 

> ### Basics
* Update du status 
* Création de suggestions
* Compteur de membres

> ### Giveaways

Permet de créer des concours, avec certaines conditions.

> ### Gestion des invitations

Calcul des invitations, différents classements disponibles.

> ### Gestion des messages

Permet d'envoyer des messages customisés et éditables, sous forme d'embed ou non.

> ### Modération 
Système de modération complet permettant d'effectuer plusieurs sanctions aux différents utilisateurs.

> ### Système de niveaux

Permet aux utilisateurs d'avoir différents niveaux lorsqu'ils discutent sur le serveur.

> ### Salons tmeporaires 

Permet de créer des salons temporaires et de les gérer facilement avec différentes commandes.

> ### Tickets

Permet une gestion complète et simple des tickets, rendant ainsi la vie des modérateurs plus simple.


## Procédure d'installation pour mise en production 
<hr>

1. Insérez à l'intérieur de `environment.prod.yaml` votre token.
2. Effectuez la commande `npm install` pour installer les dépendances.
3. Effectuez la commande `npm run build` pour build le projet.
4. Effectuez la commande `npm run start` pour lancer le bot.

## Pour reset la base de donnée

1. Fermer le bot, supprimer le fichier `database.sql`.
2. Exécutez la commande `npm run factory migration:run`.