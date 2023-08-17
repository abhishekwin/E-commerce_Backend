const {models:{userRole}} = require("../models");
console.log(userRole,"LLLLLLLL");
const secretKey = process.env.JWT_SECRET_KEY;
const adminEmail = process.env.AdminEmail;

exports.create = async (req, res) => {
  try {
    const { role, isActive } = req.body;
    console.log(req.body);
    const oldUser = await userRole.findOne({
      where: {
        role: req.body.role,
      },
    });

    if (oldUser) {
      return res.status(409).send("Role Already Exists!!");
    }
    const payload = {role,isActive };
    // let verified = null;
    // if (role == "Seller") {
    //   verified = false;
    // }
    // const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userRole.create(payload);
    // const jwtToken = jwt.sign({ userId: user.id, role: user.role }, secretKey, {
    //   expiresIn: "1h",
    // });
    res
      .send({ message: "Role added sucessfully", user })
      .status(200);
  } catch (err) {
    console.log(err,"reerer");
    res.status(500).json({ error: "Error registering role" });
  }
};