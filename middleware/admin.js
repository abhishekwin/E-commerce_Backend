const {models:{userDetail}} = require("../src/models");

const bcrypt = require("bcrypt");

const config = process.env;
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;

exports.initializeAdmin = async () => {
  try {
    
    const admin = await userDetail.findOne({where:{email:config.AdminEmail}})
 
    if (!admin) {
      const payload = {
        username: config.AdminName,
        email: config.AdminEmail,
        role: config.AdminRoll,
        isVerified:true
      };
      const hashedPassword = await bcrypt.hash(`${config.AdminPassword}`, 10);
      const user = await userDetail.create({ ...payload, password: hashedPassword });
      const token = jwt.sign({ userId: user.id, role: user.role }, secretKey);
      await userDetail.update(
        { token: token },
        {
          where: {
            id: user.id,
          },
        }
      );
      console.log("Admin user created successfully.");
    }
  } catch (error) {
    console.error("Error initializing admin user:", error);
  }
};
