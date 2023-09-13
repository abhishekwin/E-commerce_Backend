require("dotenv").config();
const {
  models: { userDetail, userRole },
} = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET_KEY;
const adminEmail = process.env.AdminEmail;
const { sendResetPasswordEmail } = require("../validation/nodemailerConfig");
const crypto = require("crypto");
exports.create = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const role = req.body.role.toLowerCase();
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
    const user_role = await userRole.findOne({
      where: {
        role: role,
      },
    });
    const payload = { username, email, role: user_role.id, isSeller: false };
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userDetail.create({
      ...payload,
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
      return res.status(400).json({ msg: "Username and Email is required." });
    }
    const user = await userDetail.findOne({
      include: [{ model: userRole }],
      where: { email },
    });

    if (!user) {
      return res.status(401).send({ error: "Unauthorized user!!!!" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid Password" });
    }

    const jwtToken = jwt.sign(
      { userId: user.id, role: user.userRole.role },
      secretKey,
      {
        expiresIn: "1h",
      },
    );
    return res.send({ message: "Login sucessfully", jwtToken }).status(200);
  } catch (error) {
    console.log(error);
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
    const seller = await userDetail.findOne({
      where: { email: req.body.email },
    });
    if (seller.isSeller == true) {
      return res
        .status(404)
        .json({ message: "You are already a verified seller" });
    }
    const admin = await userDetail.findOne({
      where: { id: req.decode.userId },
    });
    if (adminEmail == admin.email) {
      seller.isSeller = true;
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
    const user = await userDetail.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({ message: "Email Not Exist." });
    } 
    console.log(crypto.randomBytes(32).toString("hex"));
    
    user.resetPasswordToken = crypto.randomBytes(32).toString("hex");
    await user.save();
    try {
      await sendResetPasswordEmail(email, user.resetPasswordToke);
    } catch (error) {
      return res.status(505).send({ msg: `${error}` });
    }
    return res.send({ msg: "Sent Reset password link in email.", token : user.resetPasswordToken });
  } catch (error) {
    res.send({ msg: `${error}` }).status(500);
  }
};

exports.reset_Password = async (req, res) => {
  try {
    const { newPassword, confirmPassword, email} = req.body;
    if (!newPassword && !confirmPassword, !email) {
      return res.status(400).json({ msg: "Please Provide the Required Fields." });
    }
    if (!(newPassword === confirmPassword)) {
      return res
        .status(400)
        .json({ msg: "New Password are not matched with Confirm Password." });
    }
    const user = await userDetail.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!(user.resetPasswordToken === req.query.token)) {
      return res.status(401).json({ message: "Password Already changed!!" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.save();

    return res.json({ message: "Password Reset Successfully." });
  } catch (error) {
    console.log(error);
    res.send({ msg: `${error}` }).status(500);
  }
};
