/* eslint-disable no-unused-vars */
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const connectToMysql = require("../database.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyUser = require("../MiddleWare/verifyUser");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");

const otpData = new Map();

// all the user routes will be here
router.post(
  "/register",
  [
    body("username").isLength({ min: 3 }),
    body("email").isEmail(),
    body("password").isLength({ min: 8 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
      const user = connectToMysql.query(
        "SELECT * FROM users WHERE email = ?",
        req.body.email,
        async (err, result) => {
          if (err) {
            return res.status(500).json({ error: "Internal server error" });
          } else {
            if (result.length === 0) {
              const { username, email, password } = req.body;
              const salt = await bcrypt.genSalt(10);
              const hashedPassword = await bcrypt.hash(password, salt);
              const dataToInsert = {
                username,
                email,
                password: hashedPassword,
              };
              connectToMysql.query(
                "INSERT INTO users SET ?",
                dataToInsert,
                (err, result) => {
                  if (err) {
                    return res
                      .status(400)
                      .json({ error: "User cannot be registered" });
                  } else {
                    const authToken = jwt.sign(
                      { id: result.insertId },
                      process.env.JWT_SECRET
                    );
                    return res
                      .status(200)
                      .cookie("token", authToken, {
                        expires: new Date(
                          new Date().getTime() + 5 * 24 * 60 * 60 * 1000
                        ),
                        httpOnly: true,
                      })
                      .json({
                        message: "User registered successfully",
                        authToken,
                      });
                  }
                }
              );
            } else {
              return res.status(400).json({ error: "User already exists" });
            }
          }
        }
      );
    } catch (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").isLength({ min: 8 })],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
      connectToMysql.query(
        "SELECT * FROM users WHERE email = ?",
        req.body.email,
        async (err, result) => {
          if (err) {
            return res.status(500).json({ error: "Internal server error" });
          } else {
            if (result.length === 0) {
              return res.status(400).json({ error: "Invalid Credentials" });
            } else {
              const isMatch = await bcrypt.compare(
                req.body.password,
                result[0].password
              );
              if (!isMatch) {
                return res.status(400).json({ error: "Invalid credentials" });
              } else {
                const authToken = jwt.sign(
                  { id: result[0].id },
                  process.env.JWT_SECRET
                );
                const { username, email, id, createdAt } = result[0];
                return res
                  .status(200)
                  .cookie("token", authToken, {
                    expires: new Date(
                      new Date().getTime() + 5 * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true,
                  })
                  .json({
                    message: "User logged in successfully",
                    // username,
                    // email,
                    // id,
                    // createdAt,
                    authToken,
                  });
              }
            }
          }
        }
      );
    } catch (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get("/getUser", verifyUser, (req, res) => {
  return res.status(200).json(req.user);
});

router.post("/send-otp", (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const { email } = req.body;
    const otp = otpGenerator.generate(6, {
      specialChars: false,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
    });

    const expirationTime = Date.now() + 5 * 60 * 1000;
    otpData.set(email, { otp, expirationTime });

    const formattedExpirationTime = new Date(expirationTime).toLocaleTimeString(
      "en-US",
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }
    );

    const mailOptions = {
      from: process.env.GMAIL,
      to: email,
      subject: "OTP for Email Verification",
      text: `Your OTP is ${otp} and will expire at ${formattedExpirationTime}`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log("error sending OTP", err);
        return res.status(500).json({ error: "error sending OTP" });
      } else {
        console.log("OTP sent successfully");
        return res
          .status(200)
          .json({ success: true, message: "OTP sent successfully" });
      }
    });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  const currentTime = Date.now();
  const storedExpirationTime = otpData.get(email).expirationTime;
  const storedOTP = otpData.get(email).otp;
  try {
    if (currentTime > storedExpirationTime) {
      return res.status(400).json({ error: "OTP expired" });
    } else {
      if (!storedOTP || storedOTP !== otp) {
        return res.status(400).json({ error: "Invalid OTP" });
      } else {
        otpData.delete(email);
        return res
          .status(200)
          .json({ success: true, message: "OTP verified successfully" });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put(
  "/update-profile",
  [body("email").isEmail(), body("username").isLength({ min: 3 })],
  verifyUser,
  (req, res) => {
    const { username, email } = req.body;
    const dataToUpdate = {
      username,
      email,
    };
    try {
      connectToMysql.query(
        "UPDATE users SET ? WHERE id = ?",
        [dataToUpdate, req.id],
        (err, result) => {
          if (err) {
            return res.status(400).json({ error: "Profile cannot be updated" });
          } else {
            return res
              .status(200)
              .json({ success: true, message: "Profile updated successfully" });
          }
        }
      );
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.put(
  "/update-password",
  [
    body("oldPassword").isLength({ min: 8 }),
    body("newPassword").isLength({ min: 8 }),
    body("confirmPassword").isLength({ min: 8 }),
  ],
  verifyUser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const { oldPassword, newPassword, confirmPassword } = req.body;

    try {
      connectToMysql.query(
        "SELECT * FROM users WHERE id = ?",
        req.id,
        async (err, result) => {
          if (err) {
            return res.status(500).json({ error: "Internal server error" });
          } else {
            const isMatch = await bcrypt.compare(
              req.body.oldPassword,
              result[0].password
            );
            if (!isMatch) {
              return res.status(400).json({ error: "Old Password is wrong" });
            } else {
              if (newPassword !== confirmPassword) {
                return res.status(400).json({
                  error: "New Password and Confirm Password do not match",
                });
              } else if (newPassword === oldPassword) {
                return res.status(400).json({
                  error: "New Password and Old Password cannot be same",
                });
              } else {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(newPassword, salt);
                const dataToUpdate = {
                  password: hashedPassword,
                };
                connectToMysql.query(
                  "UPDATE users SET ? WHERE id = ?",
                  [dataToUpdate, req.id],
                  (err, result) => {
                    if (err) {
                      return res
                        .status(400)
                        .json({ error: "Password cannot be updated" });
                    } else {
                      return res.status(200).json({
                        success: true,
                        message: "Password updated successfully",
                      });
                    }
                  }
                );
              }
            }
          }
        }
      );
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.post("/forgot-password", (req, res) => {
  try {
    const { email } = req.body;
    connectToMysql.query(
      "SELECT * FROM users WHERE email = ?",
      email,
      async (err, result) => {
        if (err) {
          return res.status(500).json({ error: "Internal server error" });
        } else {
          if (result.length === 0) {
            return res.status(400).json({ error: "User does not exist" });
          } else {
            const otp = otpGenerator.generate(20);

            const expirationTime = Date.now() + 5 * 60 * 1000;
            otpData.set(email, { otp, expirationTime });

            const formattedExpirationTime = new Date(
              expirationTime
            ).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            });

            const transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: process.env.GMAIL,
                pass: process.env.GMAIL_PASSWORD,
              },
            });
            const resetPasswordUrl = `${req.protocol}://${req.get(
              "host"
            )}/reset-password?token=${otp}&email=${email}`;
            const mailOptions = {
              from: process.env.GMAIL,
              to: email,
              subject: "Reset Password Token",
              text: `Your reset password link is ${resetPasswordUrl} and will expire at ${formattedExpirationTime}`,
            };

            transporter.sendMail(mailOptions, (err, info) => {
              if (err) {
                return res
                  .status(500)
                  .json({ error: "Error Sending Reset Link" });
              } else {
                return res.status(200).json({
                  success: true,
                  message: "Reset Link Sent Successfully",
                });
              }
            });
          }
        }
      }
    );
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put(
  "/reset-password",
  [
    body("newPassword").isLength({ min: 8 }),
    body("confirmPassword").isLength({ min: 8 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const { newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        error: "New Password and Confirm Password do not match",
      });
    }
    const currentTime = Date.now();
    const storedExpirationTime = otpData.get(req.query.email).expirationTime;
    const storedOTP = otpData.get(req.query.email).otp;
    try {
      if (currentTime > storedExpirationTime) {
        return res.status(400).json({ error: "Reset Token Expired" });
      } else {
        if (!storedOTP || storedOTP !== req.query.token) {
          return res.status(400).json({ error: "Invalid Reset Token" });
        } else {
          otpData.delete(req.query.email);

          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(newPassword, salt);
          const dataToUpdate = {
            password: hashedPassword,
          };
          connectToMysql.query(
            "UPDATE users SET ? WHERE email = ?",
            [dataToUpdate, req.query.email],
            (err, result) => {
              if (err) {
                return res
                  .status(400)
                  .json({ error: "Password cannot be changed" });
              } else {
                return res.status(200).json({
                  success: true,
                  message: "Password reset successfully",
                });
              }
            }
          );
        }
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.post("/logout", verifyUser, (req, res) => {
  try {
    return res
      .status(200)
      .clearCookie("token")
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete(
  "/delete-account",
  [
    body("password").isLength({ min: 8 }),
    body("confirmPassword").isLength({ min: 8 }),
  ],
  verifyUser,
  async (req, res) => {
    const { password, confirmPassword } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        error: "Password and Confirm Password do not match",
      });
    }
    try {
      connectToMysql.query(
        "SELECT * FROM users WHERE id = ?",
        req.id,
        async (err, result) => {
          if (err) {
            return res.status(400).json({ error: "Account cannot be deleted" });
          } else {
            const isMatch = await bcrypt.compare(
              req.body.password,
              result[0].password
            );
            if (!isMatch) {
              return res.status(400).json({ error: "Invalid credentials" });
            }
            connectToMysql.query(
              "DELETE FROM users WHERE id = ?",
              req.id,
              async (err, result) => {
                if (err) {
                  return res
                    .status(400)
                    .json({ error: "Account cannot be deleted" });
                } else {
                  return res.status(200).clearCookie("token").json({
                    success: true,
                    message: "Account deleted successfully",
                  });
                }
              }
            );
          }
        }
      );
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

module.exports = router;
