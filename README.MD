# 📄 Test technique Pertimm

Ce projet est une implémentation en JavaScript (Node.js) permettant d'interagir avec une API basée sur **Concrete Datastore**, dans le cadre du test technique proposé par Pertimm.

## 🎯 Objectifs

Le script automatise les étapes suivantes :
1. 🔐 Enregistrement (`/auth/register/`)
2. 🔑 Connexion (`/auth/login/`)
3. 📝 Création d'une candidature (`/job-application-request/`)
4. 🔄 Polling jusqu'à obtention du statut `COMPLETED`
5. ✅ Confirmation de la candidature via un `PATCH`

## ⚙️ Prérequis

- Node.js v18 ou supérieur (compatible avec `fetch` en natif)
- Environnement Unix/Linux (testé sous WSL Debian)

## 🚀 Lancer le test

1. Cloner le projet :

```bash
git clone https://github.com/votre-nom-utilisateur/pertimm-test.git
cd pertimm-test
