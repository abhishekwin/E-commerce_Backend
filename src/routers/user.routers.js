const router = require("express").Router();
const user = require("../controllers/user.controller");
const { checkTokenExpirationAndVerification } = require("../../middleware");
// const { userValidation } = require("../validation");

router.use("/sign_up", user.create);
router.use("/get_users", user.get_users);
router.use("/login", user.login);
router.use(
  "/verify_user",
  checkTokenExpirationAndVerification,
  user.verifySeller,
);

router.use("/forget_password", user.forget_Password);
router.use(
  "/reset_password",
  checkTokenExpirationAndVerification,
  user.reset_Password,
);
module.exports = router;
