const { Sequelize, DataTypes } = require("sequelize");

// sequelize is used to create entry in mysql table format
const sequelize = new Sequelize("chat_app", "root", "Sharma@1972", {
  host: "localhost",
  dialect: "mysql",
});

const Messages = sequelize.define("Message", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  senderId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: { model: "User", key: "id" },
  },
  receiver: [
    {
      receiverId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: { model: "User", key: "id" },
      },
    },
  ],
  roomId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: { model: "Room", key: "id" },
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

module.exports = Messages;
