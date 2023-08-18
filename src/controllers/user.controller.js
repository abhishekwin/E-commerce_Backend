require("dotenv").config();
const {
  models: { userDetail },
} = require("../models");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET_KEY;
const adminEmail = process.env.AdminEmail;

// In-memory store for reset tokens and user data (for demonstration purposes)
const resetTokens = {};

exports.create = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!(email && username && password && role)) {
      return res.status(400).json({ msg: "Username and Email is required." });
    }
    const oldUser = await userDetail.findOne({
      where: {
        email: email,
      },
    });

    if (oldUser) {
      return res.status(409).send("userDetail Already Exist. Please Login");
    }
    const payload = { username, email, role };
    let verified = true;
    if (role == 2) {
      verified = false;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userDetail.create({
      ...payload,
      isVerified: verified,
      password: hashedPassword,
    });
    const jwtToken = jwt.sign(
      { userId: user.id, userRole: user.role },
      secretKey,
      {
        expiresIn: "1h",
      },
    );

    res
      .send({ message: "userDetail added sucessfully", token: jwtToken })
      .status(200);
  } catch (err) {
    res.status(500).json({ error: "Error registering user" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      res.status(400).json({ msg: "Username and Email is required." });
    }
    const user = await userDetail.findOne({ where: { email } });
    if (!user) {
      return res.status(401).send({ error: "Unauthorized userDetail" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("======>11", user.password === password, isPasswordValid);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid Password" });
    } else {
      const jwtToken = jwt.sign(
        { userId: user.id, role: user.role },
        secretKey,
        {
          expiresIn: "1h",
        },
      );
      res.send({ message: "Login sucessfully", jwtToken }).status(200);
    }
  } catch (error) {
    res.status(500).json({ error: "Error logging in user" });
  }
};

exports.get_users = async (req, res) => {
  try {
    const result = await userDetail.findAll();

    res.send({ msg: "data fetched!!", count: result.length, result });
  } catch {
    res.status(500).json({ error: error.message });
  }
};

exports.verifySeller = async (req, res) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      req.headers.authorization?.split(" ")[1];

    const decode = jwt.verify(token, secretKey);

    const seller = await userDetail.findOne({ where: { id: req.body.id } });
    if (seller.isVerified == true) {
      return res
        .status(404)
        .json({ message: "You are already a verified seller" });
    }
    const admin = await userDetail.findOne({ where: { id: decode.userId } });
    if (adminEmail == admin.email) {
      seller.isVerified = true;
      await seller.save();
      res.send({ msg: "Seller verified succesfuly", seller });
    } else {
      return res.status(404).json({ message: "You are not admin" });
    }
  } catch (error) {
    res.send("Seller not Verified").status(500);
  }
};

exports.forget_Password = async (req, res) => {
  try {
    const email = req.body.email;
    if (!email) {
      return res.status(400).json({ msg: "Email is required." });
    }
    const oldUser = await userDetail.findOne({ where: { email: email } });
    if (!oldUser) {
      return res.status(404).json({ message: "Email Not Exist." });
    }
    // Generate a reset token

    const token = crypto.randomBytes(20).toString("hex");
    resetTokens[email] = token;
    return res.send({ msg: "sent reset password link in email.", token });
  } catch (error) {
    res.send("server error!!!").status(500);
  }
};

exports.reset_Password = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;

    if (!(email && token && newPassword)) {
      return res.status(400).json({ msg: "All Fields are required." });
    }
    const user = await userDetail.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (resetTokens[email] !== token) {
      return res.status(400).json({ message: "Invalid token" });
    }

    // Update the user's password (in-memory update for demonstration)
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.save();
    delete resetTokens[email];

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.send("server error!!!").status(500);
  }
};
