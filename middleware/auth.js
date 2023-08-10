const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET_KEY;

exports.verifyToken = (req, res, next) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(403).send("Token is required for authentication.");
    }

    jwt.verify(token, secretKey, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      req.userId = decodedToken.userId;
      next();
    });
  } catch {
    res.status(404).send({ message: "user not verified" });
  }
};
