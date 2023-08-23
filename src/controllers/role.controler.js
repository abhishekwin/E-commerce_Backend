const {
  models: { userRole },
} = require("../models");

exports.create = async (req, res) => {
  try {
    const { role } = req.body;
    const oldUser = await userRole.findOne({
      where: {
        role: role,
      },
    });

    if (oldUser) {
      return res.status(409).send("Role Already Exists!!");
    }
    const user = await userRole.create({ role });
    res.send({ message: "Role added sucessfully", data: user }).status(200);
  } catch (err) {
    res.status(500).json({ error: "Error registering role" });
  }
};
