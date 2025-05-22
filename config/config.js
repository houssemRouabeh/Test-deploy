import dotenv from "dotenv";
dotenv.config();

export default {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: process.env.DB_PORT || 5432,
    dialectOptions: {
      ssl: process.env.DB_SSL === "true",
    },
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: true,
    },
  },
};