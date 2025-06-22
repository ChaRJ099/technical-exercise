
const BASE_URL = "https://hire-game.pertimm.dev";
console.log("coucou2"); 

const userData = {
  email: "charline.test@demo.com",
  password1: "motDePasseSolide123",
  password2: "motDePasseSolide123",
  first_name: "Charline",
  last_name: "Ramelet", 
};
  
let token = "";
let applicationUrl = "";
let confirmationUrl = "";


const register = async () => {
  const {email, password1, password2 } = userData;
  await fetch(`${BASE_URL}/api/v1.1/auth/register/`, {
    method: "POST",
    body: JSON.stringify({
      email,
      password1,
      password2,
    }),
  })
  .then((resp) => {console.log(resp)});
};

startServer();


function startServer() {
  const express = require("express");
  const app = express();
  const port = 4200;

  app.get("/", (req: any, res: any) => {
    res.send("Hello World!");
  });

  app.get("/register", (req: any, res: any) => {
    // register(); 

    res.send("resister");
  }); 

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}