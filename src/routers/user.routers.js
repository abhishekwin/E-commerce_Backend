const router = require("express").Router();
const user = require("../controllers/user.controller");
const { verifyToken } = require("../../middleware/auth");
const { userValidation } = require("../validation");
const userPassword = require("../controllers/user.controller");

router.use("/sign_up", user.create);
router.use("/get_users", verifyToken, user.get_users);
router.use("/login", user.login);
router.use("/verify_user", user.verifySeller);

router.use("/forget_password", userPassword.forget_Password);
router.use("/reset_password", userPassword.reset_Password);
module.exports = router;
