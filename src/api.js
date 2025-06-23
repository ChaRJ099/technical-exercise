import dotenv from "dotenv";
dotenv.config();

const BASE_URL = "https://hire-game.pertimm.dev";

const userData = {
  email: process.env.EMAIL,
  password1: process.env.PASSWORD1,
  password2: process.env.PASSWORD2,
  first_name: process.env.FIRST_NAME,
  last_name: process.env.LAST_NAME,
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
    return data.url; // Pour l'étape suivante
  } catch (error) {
    console.error(
      "Erreur lors de la création de l'application :",
      error.message
    );
    return null;
  }
};

// Fonction de polling qui interroge régulièrement l’API jusqu’à obtention du statut "COMPLETED"
export const waitForCompletion = async (token, pollingUrl) => {
  const maxRetries = 10;
  const delay = 2000;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
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

      if (data.status === "COMPLETED") {
        console.log("Statut COMPLETED atteint");
        console.log("Confirmation URL :", data.confirmation_url);
        return data.confirmation_url;
      }

      console.log(`Tentative ${attempt + 1} : statut actuel = ${data.status}`);

      // Attente avant de relancer une nouvelle tentative
      await new Promise((resolve) => setTimeout(resolve, delay));
    } catch (error) {
      console.error("Erreur pendant le polling :", error.message);
      break;
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
    const response = await fetch(confirmationUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ confirmed: true }),
    });

    if (!response.ok) {
      throw new Error(`Échec de la confirmation : ${response.status}`);
    }

    const data = await response.json();

    console.log("Candidature confirmée :", data);
    return data;
  } catch (error) {
    console.error("Erreur lors de la confirmation :", error.message);
    return null;
  }
};
