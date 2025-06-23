import {
  register,
  login,
  createApplication,
  waitForCompletion,
  confirmApplication,
} from "./api.js";

/**
 * Fonction principale orchestrant l’ensemble du processus de candidature :
 * - Enregistre un utilisateur
 * - Connecte l’utilisateur et récupère le token
 * - Crée une demande de candidature
 * - Attend que le statut passe à "COMPLETED" via polling
 * - Confirme la candidature dans un délai de 30 secondes
 *
 * Toutes les erreurs sont capturées via un bloc try/catch.
 *
 * @returns {Promise<void>}
 */
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

main();
