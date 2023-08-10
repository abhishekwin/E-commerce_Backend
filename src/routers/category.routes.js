const router = require('express').Router()
const category = require("../controllers/category.controller")



router.use("/addCategory",category.addCategory)
router.use("/Category",category.get_allCategory)
router.use("/deleteCategory",category.deleteCategory)
module.exports = router