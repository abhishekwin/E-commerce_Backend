const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;
const adminEmail = process.env.AdminEmail;
exports.create = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const oldUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }
    const payload = { username, email, role };
    let verified = null;
    if (role == "Seller") {
      verified = false;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      ...payload,
      isVerified: verified,
      password: hashedPassword,
    });
    const jwtToken = jwt.sign({ userId: user.id, role: user.role }, secretKey, {
      expiresIn: "1h",
    });
    res
      .send({ message: "User added sucessfully", token: jwtToken })
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
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({ error: "Unauthorized User" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid Password" });
    } else {
      const jwtToken = jwt.sign(
        { userId: user.id, role: user.role },
        secretKey,
        { expiresIn: "1h" }
      );
      res.send({ message: "Login sucessfully", token: jwtToken }).status(200);
    }
  } catch (error) {
    res.status(500).json({ error: "Error logging in user" });
  }
};

exports.get_users = async (req, res) => {
  try {
    const result = await User.findAll();

    res.send({ msg: "data fetched!!", count: result.length, result });
  } catch {
    res.status(500).json({ error: error.message });
  }
};

exports.verifySeller = async (req, res) => {
  try {
    console.log("KSKSKSK");
    const token = req.body.token || req.query.token || req.headers.authorization?.split(' ')[1];

    const decode = jwt.verify(token, secretKey);

    const seller = await User.findOne({ where: { id: req.body.id } });
    if (seller.isVerified == true) {
      return res
        .status(404)
        .json({ message: "You are already a verified seller" });
    }
    const admin = await User.findOne({ where: { id: decode.userId } });
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
