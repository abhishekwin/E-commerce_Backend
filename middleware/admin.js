const {
  models: { userDetail, userRole },
} = require("../src/models");

const bcrypt = require("bcrypt");

const config = process.env;
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;


exports.hash_password = async ( password ) =>{
  const hashedPassword = await bcrypt.hash(`${password}`, 10);
  return hashedPassword
}

exports.initializeAdmin = async () => {
  try {
    const is_Role = await userRole.findOne({
      where: {
        role: "admin",
      },
    });
    if (!is_Role) {
      return;
    }
    const admin = await userDetail.findOne({
      where: { email: config.AdminEmail },
    });
    if (!admin) {
      const payload = {
        username: config.AdminName,
        email: config.AdminEmail,
        role: is_Role.id,
        isSeller: true,
      };

      const user = await userDetail.create({
        ...payload,
        password: hash_password(config.AdminPassword),
      });
      jwt.sign({ userId: user.id, role: user.role }, secretKey);
      console.log("Admin user created successfully.");
      return;
    }
    console.log("Amdin exist!!");
    return;
  } catch (error) {
    console.error("Error initializing admin user:", error);
    return;
  }
};
