const { Sequelize } = require("sequelize");

// You can also use environment variables for these values
const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: true,   // set to true to see SQL queries
  }
);
//sequelize.sync({ alter: true }); // Sync models to the database.

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = sequelize;
module.exports.connectDB = connectDB;
