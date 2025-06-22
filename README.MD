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

## Arborescence

technical-exercise/
├── src/
│ └── index.js # Script principal
├── .gitignore
├── package.json
├── README.md

## Installation

Cloner le dépôt puis installer les dépendances :

```bash
git clone https://github.com/ChaRJ099/technical-exercise.git

npm install
```

Ce projet n'utilise pas de dépendances Node, mais la commande npm install est utile pour initialiser le projet si besoin (ex. future extension).

## ▶️ Lancer le script

npm run start

Assurez-vous que votre version de Node est compatible (node -v doit retourner ≥ 18.x, sinon les appels fetch() échoueront).

## Données de test
Le fichier src/index.js contient les données de test suivantes :

const userData = {
  email: "charline.test@demo.com",
  password1: "motDePasseSolide123",
  password2: "motDePasseSolide123",
  first_name: "Charline",
  last_name: "Ramelet",
};

=> Modifiez ces données si vous exécutez plusieurs fois le script pour éviter les conflits d’inscription.

## Données de test
- La confirmation doit être envoyée moins de 30 secondes après le début du test.

- En cas d’échec à une étape, une erreur explicite est affichée dans la console.

- Le script utilise un système de polling avec temporisation pour interroger l’API toutes les 2 secondes, jusqu’à 10 tentatives.

## Contact
Ce test a été réalisé par *Charline Ramelet* dans le cadre du processus de recrutement Pertimm.
N'hésitez pas à me contacter pour toute précision technique ou suggestion.

