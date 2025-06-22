const BASE_URL = "https://hire-game.pertimm.dev";


const userData = {
  email: "charline.test@demo.com",
  password1: "motDePasseSolide123",
  password2: "motDePasseSolide123",
  first_name: "Charline",
  last_name: "Ramelet",
};

// Enregistrer un utilisateur
export const register = async () => {
  const { email, password1, password2, first_name, last_name } = userData;

  try {
    const response = await fetch(`${BASE_URL}/api/v1.1/auth/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password1,
        password2,
        first_name,
        last_name,
      }),
    });

    if (!response.ok) {
      throw new Error(`Register failed: ${response.status}`);
    } else {
      console.log("Utilisateur enregistré !");
      return response.status;
    }
  } catch (error) {
    console.error(error.message);
  }
};

// Connexion et récupération du token
export const login = async () => {
  const { email, password1 } = userData;
  try {
    const response = await fetch(`${BASE_URL}/api/v1.1/auth/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password: password1,
      }),
    });
    if (!response.ok) {
      throw new Error(`Login failed: ${response.status}`);
    } else {
      return response.json().then((data) => data.token);
    }
  } catch (error) {
    console.error(error.message);
  }
};

// Création de l'application
export const createApplication = async (token) => {
  const { email, first_name, last_name } = userData;

  try {
    const response = await fetch(
      `${BASE_URL}/api/v1.1/job-application-request/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ email, first_name, last_name }),
      }
    );

    if (!response.ok) {
      throw new Error(`Création application failed: ${response.status}`);
    }

    const data = await response.json();
    console.log("Application créée !");
    console.log("URL de polling :", data.url);
    return data.url; // Pour l'étape suivante
  } catch (error) {
    console.error("Error", error.message);
    return null;
  }
};

// Fonction de polling qui interroge régulièrement l’API jusqu’à obtention du statut "COMPLETED"
export const waitForCompletion = async (token, pollingUrl) => {
  const maxRetries = 10; // Nombre maximum de tentatives avant d’abandonner
  const delay = 2000; // Délai d’attente entre deux requêtes (en millisecondes)

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Envoi d’une requête GET avec authentification
      const response = await fetch(pollingUrl, {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Polling failed: ${response.status}`);
      }

      const data = await response.json();

      // Vérifie si le statut retourné est "COMPLETED"
      if (data.status === "COMPLETED") {
        console.log("Statut COMPLETED atteint");
        console.log("Confirmation URL :", data.confirmation_url);
        return data.confirmation_url; // Retourne l’URL de confirmation dès que l’état est bon
      }

      console.log(`Tentative ${attempt + 1} : statut actuel = ${data.status}`);

      // Attente avant de relancer une nouvelle tentative
      await new Promise((resolve) => setTimeout(resolve, delay));
    } catch (error) {
      console.error("Erreur pendant le polling :", error.message);
      break; // Quitte la boucle en cas d’erreur critique
    }
  }

  // Si le statut "COMPLETED" n’est jamais atteint
  console.error(
    "Timeout : statut COMPLETED non atteint après plusieurs tentatives"
  );
  return null;
};

// Envoi de la confirmation de candidature à l'API
export const confirmApplication = async (token, confirmationUrl) => {
  try {
    // Envoi d'une requête PATCH sur l'URL obtenue à l'étape précédente
    const response = await fetch(confirmationUrl, {
      method: "PATCH", // Méthode HTTP adaptée à la mise à jour partielle d'une ressource
      headers: {
        "Content-Type": "application/json", // Format des données envoyées
        Authorization: `Token ${token}`,    // Authentification avec le token obtenu après login
      },
      body: JSON.stringify({ confirmed: true }), // Corps de la requête : on confirme la candidature
    });

    // Si la réponse HTTP n'est pas OK (statut 200–299), on lance une erreur explicite
    if (!response.ok) {
      throw new Error(`❌ Échec de la confirmation : ${response.status}`);
    }

    // Récupération de la réponse JSON (peut contenir un message ou un état)
    const data = await response.json();

    // Journalisation de la confirmation réussie
    console.log("🎉 Candidature confirmée :", data);

    // On retourne les données pour éventuellement les utiliser ou les afficher
    return data;
  } catch (error) {
    // En cas d'échec du PATCH, on logue une erreur claire
    console.error("❌ Erreur lors de la confirmation :", error.message);
    return null; // On retourne null pour garder la chaîne logique dans la fonction principale
  }
};
