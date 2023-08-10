const router = require("express").Router();
const product = require("../controllers/product.controller");
const uploads = require("../controllers/product.controller");

router.use(
  "/uploadProduct",
  uploads.upload.single("productImageUrl"),
  product.create,
);
router.use("/getProducts", product.get_products);
router.use("/getSellerProduct", product.getsellerProduct);
router.use("/getProductByCategory", product.getProductByCategory);
router.use("/deleteProduct", product.deleteProduct);
module.exports = router;
