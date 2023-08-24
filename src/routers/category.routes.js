const router = require("express").Router();
const category = require("../controllers/category.controller");
const uploads = require("../config/fileConfig");
const { checkTokenExpirationAndVerification } = require("../../middleware");

router.use(
  "/addCategory",
  uploads.upload.single("categoryImage"),
  checkTokenExpirationAndVerification,
  category.addCategory,
);
router.use("/Category", category.get_allCategory);
router.use("/deleteCategory", category.deleteCategory);

module.exports = router;
  