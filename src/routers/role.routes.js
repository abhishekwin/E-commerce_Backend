const router = require("express").Router();
const role = require("../controllers/role.controler");


router.use("/role", role.create);
// router.use("/get_users", verifyToken, user.get_users);
// router.use("/login", user.login);
// router.use("/verify_user", user.verifySeller);

module.exports = router;
