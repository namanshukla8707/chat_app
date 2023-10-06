const express = require("express");
const router = express.Router();
const connectToMysql = require("../database.js");
const { body, validationResult } = require("express-validator");

const verifyUser = require("../MiddleWare/verifyUser.js");

// all the room routes will be here
router.post(
  "/createRoom",
  [
    body("roomId").notEmpty().withMessage("Room Id is required"),
    body("roomName").notEmpty().withMessage("Room Name is required"),
  ],
  verifyUser,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const { roomId, roomName, user } = req.body;
      const userIds = JSON.parse(req.id);
    
    const dataToInsert = { roomId, roomName, userIds };
    connectToMysql.query(
      "Select * from rooms where roomId = ?",
      roomId,
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: "Internal server error", err });
        } else {
          if (result.length === 0) {
            connectToMysql.query(
              "INSERT INTO rooms SET ?",
              dataToInsert,
              (err, result) => {
                if (err) {
                  return res
                    .status(500)
                    .json({ error: "Room cannot be created" ,err});
                } else {
                  return res
                    .status(200)
                    .json({ message: "Room created successfully", result:result[0] });
                }
              }
            );
          } else {
            return res.status(400).json({ error: "Room already exists" });
          }
        }
      }
    );
  }
);

module.exports = router;
