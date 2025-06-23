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

/**
 * Enregistre un nouvel utilisateur via l’API d’inscription.
 *
 * Les données d’utilisateur sont récupérées depuis les variables d’environnement.
 *
 * @returns {Promise<number|undefined>} Le statut HTTP (ex: 200) si la requête réussit, sinon `undefined` en cas d’erreur
 */
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

/**
 * Connecte un utilisateur et récupère un jeton d’authentification.
 *
 * Les identifiants sont récupérés depuis les variables d’environnement.
 *
 * @returns {Promise<string|undefined>} Le token JWT si la connexion réussit, sinon `undefined`
 */
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

/**
 * Crée une nouvelle demande de candidature via l’API.
 *
 * @param {string} token Le jeton d’authentification de l’utilisateur (reçu après login)
 * @returns {Promise<string|null>} L’URL de polling reçue de l’API, ou `null` en cas d’erreur
 */
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

/**
 * Effectue un polling sur l’URL donnée jusqu’à ce que le statut de la candidature soit "COMPLETED".
 *
 * @param {string} token Le jeton d’authentification de l’utilisateur
 * @param {string} pollingUrl L’URL fournie par l’API pour surveiller l’état de la candidature
 * @returns {Promise<string|null>} L’URL de confirmation à utiliser dans la dernière étape, ou `null` si le statut n’a pas été atteint
 */
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

  /**
   * Envoie une requête PATCH à l’API pour confirmer la candidature.
   *
   * @param {string} token Le jeton d’authentification de l’utilisateur
   * @param {string} confirmationUrl L’URL dédiée fournie par l’API pour confirmer la candidature
   * @returns {Promise<Object|null>} Les données retournées par l’API après confirmation, ou `null` en cas d’échec
   */
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
