# Test Technique Pertimm

Ce projet répond au test technique proposé par **Pertimm**. Il consiste à automatiser une série d'interactions avec une API construite avec **Concrete Datastore**.

## Objectifs du script

Le script automatise les étapes suivantes :

1. Enregistrement d’un utilisateur (`/auth/register/`)
2. Connexion et récupération du token (`/auth/login/`)
3. Création d’une demande de candidature (`/job-application-request/`)
4. Polling régulier jusqu’à ce que la candidature passe au statut `COMPLETED`
5. Confirmation de la candidature via une requête `PATCH`

## Technologies utilisées

- **Node.js** (version recommandée : ≥ 18.x)
- **JavaScript** (ES6+)
- API **Fetch** natif (aucune dépendance externe)
- Fichier `.env` pour la configuration utilisateur

## Installation

Cloner le dépôt puis initialiser le projet :

```bash
git clone https://github.com/ChaRJ099/technical-exercise.git
cd technical-exercise
npm install
```

## Configuration des variables d'environnement

Créer un fichier .env à la racine du projet contenant les données de test comme ceci :

```dotenv
EMAIL=test.user@example.com
PASSWORD1=StrongPassword123
PASSWORD2=StrongPassword123
FIRST_NAME=Test
LAST_NAME=User
```

Ce fichier contient des informations sensibles, il est ignoré par Git grâce au .gitignore.

## Lancer le script

npm run start

Assurez-vous que votre version de Node est compatible (node -v doit retourner ≥ 18.x), sinon les appels fetch() échoueront.

## Détails techniques

- Le script utilise un système de polling toutes les 2 secondes pendant 10 tentatives maximum.
- La confirmation (PATCH) doit être envoyée moins de 30 secondes après le début du test, conformément à la consigne.
- Toutes les erreurs sont gérées avec des messages explicites dans la console.

## Sources et documentation

Ce projet s’est appuyé sur plusieurs ressources externes pour respecter les bonnes pratiques JavaScript et les mécanismes de communication avec une API :

## 🔗 Sources et références

- [MDN Web Docs – Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [MDN Web Docs – Promises en JavaScript](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [Dev.to – Polling Requests to an API in JavaScript](https://dev.to/siddharthssb11/polling-requests-to-an-api-in-javascript-1g2d)
- [Medium – Exploring Short Polling in JavaScript (Mar 2024)](https://medium.com/@chaganti.sailesh/exploring-short-polling-in-javascript-a-real-time-approach-to-data-updates-765805cc88c5)
- Documentation fournie par Pertimm (API Concrete Datastore)

## Auteur

Ce test a été réalisé par Charline Ramelet dans le cadre du processus de recrutement Pertimm.
Pour toute question ou précision, n'hésitez pas à me contacter.
