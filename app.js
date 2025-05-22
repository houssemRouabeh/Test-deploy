import express from "express"; // Importation du module Express pour créer le serveur web
import * as dotenv from "dotenv"; // Importation du module dotenv pour charger les variables d'environnement à partir d'un fichier .env
import routes from "./src/routers/router.js"; // Importation des routes définies dans le fichier router.js
import path from "path"; // Importation du module path pour gérer et manipuler les chemins de fichiers/dossiers
import { fileURLToPath } from "url"; // Importation pour convertir les URL en chemins de fichiers, nécessaire dans un module ESM
import { parseBody } from "./src/middleware/parseBody.middleware.js";
import passport from "passport"; // Importation de Passport pour la gestion de l'authentification
import { configPassport } from "./config/passeport.js"; // Importation de la configuration de Passport
import flash from "connect-flash";
import session from "express-session";
import cookieParser from "cookie-parser";

// Charger les variables d'environnement à partir du fichier .env (ex : le port)
dotenv.config();

// Résoudre __dirname et __filename dans un module ESM (ces variables ne sont pas disponibles par défaut en ES Modules)
// __filename : chemin complet du fichier actuel
// __dirname : dossier contenant le fichier actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Définir le port de l'application soit via la variable d'environnement, soit par défaut à 3000
const port = process.env.PORT || 3000;
const app = express(); // Créer une nouvelle application Express

// Initialisation de Passport
configPassport(passport); // Configurer Passport avec la stratégie définie dans config/passeport.js

// Utiliser le dossier public pour servir des fichiers statiques (CSS, images, JS compilé, etc.)
// 'public' contient généralement des fichiers accessibles par le navigateur, tels que CSS, JavaScript client, images, etc.
app.use(express.static(path.join(__dirname, "public")));

// Configurer EJS comme moteur de templates pour générer des pages HTML dynamiques à partir de templates EJS
app.set("view engine", "ejs");

// Indiquer à Express où se trouvent les vues (fichiers .ejs) : dans le dossier 'src/views'
app.set("views", path.join(__dirname, "src", "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser()); // Middleware pour parser les cookies dans les requêtes HTTP

// Configuration de la session (à mettre avant app.use(flash()))
app.use(
  session({
    secret: "votre_cle_secrete", // Changez ceci par une chaîne complexe
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // HTTPS en production
      maxAge: 24 * 60 * 60 * 1000, // 24 heures
    },
  })
);

app.use(flash());

// Middleware pour rendre les messages disponibles dans toutes les vues
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});
// Initialisation de Passport (après session et cookieParser)
app.use(passport.initialize());
app.use(passport.session());

// Middleware pour ajouter Passport à toutes les requêtes
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
// Utiliser les routes importées
// Toutes les routes définies dans router.js seront accessibles à partir de l'URL racine ('/')
app.use(routes);

// Appliquer le middleware globalement
//app.use(parseBody);

// Démarrer le serveur sur le port défini et afficher un message dans la console
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`); // Message pour indiquer que le serveur fonctionne
});
