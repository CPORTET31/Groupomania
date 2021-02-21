# Backend

## Installation

1 - Installer les dépendances du projets :
```
npm install
```

2 - Configurer le fichier config/config.json :
```
    "username": "YOUR_USERNAME",
    "password": "YOUR_PASSWORD",
    "database": "YOUR_DB_NAME",
    "host": "YOUR_HOST",
    "dialect": "mysql",
    "operatorsAliases": false,
    "timezone": "SYSTEM"
```

3 - Run :
```
npx sequelize db:create
```

4 - Run :
```
npx sequelize db:migrate
```

5 - (Optional) Importer le fichier SQL (mockup.sql) dans votre MySQL afin d'avoir un jeu de données pré-établi.
    Utilisateur par défaut : grouper
    Mot de passe par défaut : Groupomania!2021!

## Exécution

Lancer le serveur en local :
```
npm start
```
