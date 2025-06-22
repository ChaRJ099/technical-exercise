# Test Technique Pertimm

Ce projet a pour objectif de répondre au test technique proposé par Pertimm, consistant à interagir avec une API basée sur **Concrete Datastore**.  
Le script automatise les étapes suivantes :

1. Enregistrement d’un utilisateur
2. Connexion pour obtenir un token
3. Création d’une demande de candidature
4. Attente du statut `COMPLETED`
5. Confirmation de la candidature

## Technologies utilisées

- Node.js (version recommandée : 18.x)
- JavaScript (ES6+)
- `fetch` natif (aucune dépendance externe)

## 🛠️ Installation

Cloner ce dépôt puis installer les dépendances :

```bash
git clone https://github.com/votre-utilisateur/technical-exercise.git
cd technical-exercise
npm install

## Lancer le script

npm run start
