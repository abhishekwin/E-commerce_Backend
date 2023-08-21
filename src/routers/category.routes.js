const router = require("express").Router();
const category = require("../controllers/category.controller");
const uploads = require("../config/fileConfig");
const { checkTokenExpiration } = require("../../middleware");

router.use(
  "/addCategory",
  uploads.upload.single("categoryImage"),
  checkTokenExpiration,
  category.addCategory,
);
router.use("/Category",checkTokenExpiration, category.get_allCategory);
router.use("/deleteCategory",checkTokenExpiration, category.deleteCategory);

module.exports = router;
