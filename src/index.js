import {
  register,
  login,
  createApplication,
  waitForCompletion,
  confirmApplication,
} from "./api.js";

// Fonction principale
async function main() {
  try {
    const registeredStatus = await register();
    if (registeredStatus !== 200) throw new Error("Échec de l'inscription");

    const token = await login();
    if (!token) throw new Error("Token non récupéré après le login");

    const pollingUrl = await createApplication(token);
    if (!pollingUrl) throw new Error("URL de polling non récupérée");

    const confirmationUrl = await waitForCompletion(token, pollingUrl);
    if (!confirmationUrl) throw new Error("Confirmation URL non récupérée");

    await confirmApplication(token, confirmationUrl);
    console.log("Candidature confirmée avec succès !");
  } catch (error) {
    console.error("Erreur dans le processus :", error.message);
  }
}

// Lancement du script
main();