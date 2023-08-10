const router = require("express").Router();
const user = require("../controllers/user.controller");
const { verifyToken } = require("../../middleware/auth");
const { userValidation } = require("../validation");

router.use("/sign_up", userValidation.userValidation, user.create);
router.use("/get_users", verifyToken, user.get_users);
router.use("/login", user.login);
router.use("/verify_user", user.verifySeller);

module.exports = router;
