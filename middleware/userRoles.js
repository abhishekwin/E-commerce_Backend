const {
  models: { userRole },
} = require("../src/models");

exports.intilize_user_roles = async () => {
  try {
    let roles = ["admin", "user", "seller"];

    for (let role of roles) {
      if (!roles.includes(role)) {
        return;
      }
      const user_role = await userRole.findOne({
        where: {
          role: role,
        },
      });
      if (!user_role) {
        await userRole.create({ role });
      }
    }
    console.log(`role created : ${roles}`);
    return;
  } catch (err) {
    console.log(err);
    return;
  }
};
