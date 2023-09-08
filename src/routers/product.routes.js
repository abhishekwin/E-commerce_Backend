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
router.use("/products/:id", product.get_product_details);
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

//add cart router

router.use("/addCart", checkTokenExpirationAndVerification, cart.handle_cart);
router.use("/deleteCartProducts", cart.remove_product_in_cart);
router.use("/getAddCart", cart.getcart);
module.exports = router;
