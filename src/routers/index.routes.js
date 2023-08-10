
const apiRouter = require('express').Router();

const router = require("./user.routers")
const productRoutes = require("./product.routes")
const categoryRoute = require("./category.routes")

apiRouter.use('/user', router)
apiRouter.use('/product', productRoutes)
apiRouter.use('/category', categoryRoute)


module.exports = apiRouter;