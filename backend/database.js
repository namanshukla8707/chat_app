const mysql = require("mysql");

// dotenv is a package that allows us to use environment variables
require("dotenv").config();

const connectToMysql = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.DATABASE_PASSWORD,
  database: "chat_app",
});

// Connecting to the database
connectToMysql.connect((err) => {
  if (err) {
    console.error(err.message);
  } else {
    return console.log("Connected to database");
  }
});

module.exports = connectToMysql;
