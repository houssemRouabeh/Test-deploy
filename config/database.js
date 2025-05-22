// config/database.js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: process.env.DB_PORT || 5432,
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: true,
    },
    dialectOptions: {
      ssl: process.env.DB_SSL === "true",
    },
  }
);

// Test de connexion
(async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connection established");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
})();

export default sequelize;