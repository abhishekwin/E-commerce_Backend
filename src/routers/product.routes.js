const router = require("express").Router();
const product = require("../controllers/product.controller");
const uploads = require("../config/fileConfig");
const cart = require("../controllers/cart.controller");
const { checkTokenExpirationAndVerification } = require("../../middleware");

router.use(
  "/uploadProduct",
  checkTokenExpirationAndVerification,
  uploads.upload.single("productImage"),
  product.create,
);
router.use("/getProducts", product.get_products);
router.use(
  "/getSellerProduct",
  checkTokenExpirationAndVerification,
  product.getsellerProduct,
);
router.use("/getProductByCategory", product.getProductByCategory);
router.use(
  "/deleteProduct",
  checkTokenExpirationAndVerification,
  product.deleteProduct,
);
router.use("/addCart", cart.handle_cart);
module.exports = router;
