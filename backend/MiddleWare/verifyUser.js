const jwt = require("jsonwebtoken");
const connectToMysql = require("../database");
const verifyUser = (req, res, next) => {
  //front-end
  // const { token } = req.body;

  //back-end
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ error: "Please login first" });
  }
  const { id } = jwt.verify(token, process.env.JWT_SECRET);
  try {
    connectToMysql.query(
      "SELECT username,email FROM users WHERE id = ?",
      id,
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: "Internal server error" });
        } else {
          if (result.length === 0) {
            return res.status(401).json({ error: "Please login first" });
          } else {
            req.user = result[0];
            req.id = id;
            next();
          }
        }
      }
    );
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = verifyUser;
