/* eslint-disable no-unused-vars */
const express = require("express");
const connectToMysql = require("./database.js");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const User = require("./Models/UserModel.js");
const Room = require("./Models/RoomModel.js");
const Message = require("./Models/MessagesModel.js");

// dotenv is a package that allows us to use environment variables
require("dotenv").config();

const app = express();
app.use(cors());
// body-parser is a package that allows us to use req.body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// cookie-parser is a package that allows us to use req.cookies
app.use(cookieParser());

// endpoints
app.use("/api/user", require("./Routes/UserRoutes.js"));
app.use("/api/room", require("./Routes/RoomRoutes.js"));

// creating a server and listening to it
app.listen(process.env.PORT_NO, () => {
  console.log(`Server is listening at port ${process.env.PORT_NO}`);
});
