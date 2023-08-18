const router = require("express").Router();
const role = require("../controllers/role.controler");

router.use("/role", role.create);

module.exports = router;
