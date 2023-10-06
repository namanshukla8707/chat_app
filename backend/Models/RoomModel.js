const { Sequelize, DataTypes } = require("sequelize");
const User = require("./UserModel.js");
const Message = require("./MessagesModel.js");
// sequelize is used to create entry in mysql table format

const sequelize = new Sequelize("chat_app", "root", "Naman123", {
  host: "localhost",
  dialect: "mysql",
});

const Room = sequelize.define("Room", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  roomId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  roomName: { type: DataTypes.STRING, allowNull: false },
  userIds: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
  messageIds: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
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
});

sequelize.sync({ force: false });
module.exports = Room;
