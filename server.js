const express = require("express");
const bodyParser = require("body-parser");
const bCrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const register = require("./controllers/register");
const signIn = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

require("dotenv").config();

const db = knex({
  development: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PWD,
      database: process.env.DB_DATABASE,
    },
  },
  production: {
    client: "pg",
    connection: process.env.DATABASE_URL + "?ssl=true",
  },
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Its working");
});

app.post("/signin", (req, res) => signIn.handleSignIn(req, res, db, bCrypt));
app.post("/register", (req, res) =>
  register.handleRegister(req, res, db, bCrypt)
);
app.get("/profile/:id", (req, res) => profile.hangleProfileGet(req, res, db));
app.put("/image", (req, res) => image.handlePutImage(req, res, db));

app.listen(process.env.PORT || 3000, () => {
  console.log(`app is listening on port ${process.env.PORT}`);
});
