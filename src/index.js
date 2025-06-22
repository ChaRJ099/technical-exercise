const { resolve } = require("path");

const BASE_URL = "https://hire-game.pertimm.dev";

const userData = {
  email: "charline.test@demo.com",
  password1: "motDePasseSolide123",
  password2: "motDePasseSolide123",
  first_name: "Charline",
  last_name: "Ramelet",
};

// Fonction principale
async function main() {
  const registeredStatus = await register(); // facultatif si déjà inscrit

  if (registeredStatus === 200) {
    const token = await login();
    console.log("token", token);
    // await createApplication(token);
    // await waitForCompletion(token);
    // await confirmApplication(token);
  }
}

// Enregistrer un utilisateur
const register = async () => {
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
const login = async () => {
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

// Create application
const createApplication = async () => {
  const { email, first_name, last_name } = userData;

  const response = await fetch(
    `${BASE_URL}/api/v1.1/job-application-request/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        email,
        first_name,
        last_name,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Création app failed: ${response.status}`);
  }
};

// Lancement du script
main();
