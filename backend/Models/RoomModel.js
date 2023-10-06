const { Sequelize, DataTypes } = require("sequelize");

// sequelize is used to create entry in mysql table format
const sequelize = new Sequelize("chat_app", "root", "Sharma@1972", {
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
  users: [
    {
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: { model: "User", key: "id" },
      },
    },
  ],
  messages: [
    {
      messageId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: { model: "Message", key: "id" },
      },
    },
  ],
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
