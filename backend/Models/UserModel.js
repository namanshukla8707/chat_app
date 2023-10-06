/* eslint-disable no-unused-vars */
const { Sequelize, DataTypes } = require("sequelize");

// sequelize is used to create entry in mysql table format
const sequelize = new Sequelize("chat_app", "root", "Naman123", {
  host: "localhost",
  dialect: "mysql",
});

const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  },
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});

// Sync the model with database
sequelize.sync({ force: false }); // it is false because we don't want to create the new table every run and loose our data

module.exports = User;
