import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { fileURLToPath } from "url";
import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const basename = path.basename(filename);

const db = {};

// Chargez d'abord tous les modèles
const modelFiles = fs
  .readdirSync(dirname)
  .filter(
    (file) =>
      file !== basename &&
      file.endsWith(".js") &&
      !file.startsWith(".") &&
      !file.includes(".test.js")
  );

// Chargez les modèles en deux passes
for (const file of modelFiles) {
  try {
    const modelPath = path.join(dirname, file);
    const modelUrl = pathToFileURL(modelPath).href;
    const modelModule = await import(modelUrl);
    const model = modelModule.default(sequelize, DataTypes);
    db[model.name] = model;
  } catch (error) {
    console.error(` Error loading model ${file}:`, error);
    process.exit(1);
  }
}

// Ensuite, configurez les associations
for (const file of modelFiles) {
  try {
    const modelPath = path.join(dirname, file);
    const modelUrl = pathToFileURL(modelPath).href;
    const modelModule = await import(modelUrl);

    const model = db[modelModule.default.name];
    if (model && typeof model.associate === "function") {
      model.associate(db);
    }
  } catch (error) {
    console.error(` Error setting associations for ${file}:`, error);
  }
}

// Synchronisation
if (process.env.NODE_ENV !== "production") {
  await sequelize
    .sync({ alter: true })
    .then(() => console.log("Database synchronized"))
    .catch((err) => console.error("Sync error:", err));
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
