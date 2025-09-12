require('dotenv').config(); // load variables from .env

module.exports = {
  development: {
    username: process.env.DB_USERNAME, 
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: true // set to console.log to see SQL queries
  }
};
