
const Product = require("../models/product.model")
const Seller = require("../models/user.model")
const multer = require('multer');
const path = require('path');
const express = require('express');
const { log } = require("console");
const app = express();
require("../models/assosiations")

const storage = multer.diskStorage({
    destination: 'uploads/', // Specify the folder to store the uploaded images
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const extension = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + extension);
    },
  });
  exports.upload = multer({ storage: storage });
  app.use(express.json());

exports.create = async (req, res) => {
    const { originalname, filename } = req.file;
    console.log(req.file,"<><>?<><><");
    const imageUrl = `http://localhost:3000/uploads/${filename}`;
    try {

        const { productName, description, category, price, inStock } = req.body
        const seller = await Seller.findOne({ where: { id: req.query.id } })

        if (seller.isVerified) {
            const payload = { productName, description, category, price, inStock, sellerId: seller.id ,productImageUrl:imageUrl}
            data = await Product.create(payload)

            res.send({ "message": "Product save sucessfully", result: data })
        }

    } catch {
        res.send("You are not a verified seller")
    }
}

exports.getsellerProduct = async (req, res) => {

    try {
        const seller = await Seller.findOne({ where: { id: req.query.id } })

        const userWithPosts = await Seller.findByPk(seller.id, { include: Product });
        if (userWithPosts.productDetails.length != 0) {
            res.send({ msg: "Product Fetched fetched!!", data: userWithPosts.productDetails })
        } else {
            res.send("Dont have product")
        }

    } catch {
        res.send("not fetchjed")
    }
}



exports.get_products = async (req, res) => {
    try {
        const result = await Product.findAll()
        res.send({ msg: "Product Fetched fetched!!", count: result.length, result })
    } catch {
        res.send("not fetchjed")
    }
}

exports.getProductByCategory = async(req,res)=>{
    try {
        
        const category = await Product.findAll({where:{category:req.query.category }})
        res.send({ msg: "Product Fetched fetched!!", category})

    } catch (error) {
        res.send(error)
    }
}

exports.get_allCategory = async(req,res)=>{
    try {
        const modelAttributes = Product.getAttributes();
        const enumValues = modelAttributes.category.values;
        res.json(enumValues);
      } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
      }
}
