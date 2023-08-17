const Product = require("../models/productdetails");
const Seller = require("../models/user-details");
const Category = require("../models/categoriess");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const express = require("express");
// require("../models/associations");
const dotenv = require("dotenv");
dotenv.config();
const adminEmail = process.env.AdminEmail;

const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET_KEY;
// const storage = multer.diskStorage({
//     destination: 'uploads/', // Specify the folder to store the uploaded images
//     filename: (req, file, cb) => {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//       const extension = path.extname(file.originalname);
//       cb(null, file.fieldname + '-' + uniqueSuffix + extension);
//     },
//   });
//   exports.upload = multer({ storage: storage });
//   app.use(express.json());

const app = express();
exports.upload = multer({ dest: "uploads/" });

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.Cloud_Name,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
exports.create = async (req, res) => {
  try {
    const { productName, description, category, price, inStock } = req.body;
    const token =
      req.body.token ||
      req.query.token ||
      req.headers.authorization?.split(" ")[1];
    const decode = jwt.verify(token, secretKey);

    const seller = await Seller.findOne({ where: { id: decode.userId } });

    const categoryNm = await Category.findOne({
      where: { categoryName: category },
    });

    if (!categoryNm.categoryName) {
      res.send({ message: "Invalid Category" });
    }
    if (seller.isVerified) {
      const result = await cloudinary.uploader.upload(req.file.path);

      const payload = {
        productName,
        description,
        category,
        price,
        inStock,
        productImageUrl: result.secure_url,
        sellerId: seller.id,
      };

      data = await Product.create(payload);

      res
        .send({ message: "Product save sucessfully", result: data })
        .status(200);
    } else {
      res.send("You are not a verified seller");
    }
  } catch (err) {
    console.log(err, "err");
    res.send("Error Adding Product");
  }
};

exports.getsellerProduct = async (req, res) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      req.headers.authorization?.split(" ")[1];

    const decode = jwt.verify(token, secretKey);
    const seller = await Seller.findOne({ where: { id: decode.userId } });

    const userWithPosts = await Seller.findByPk(seller.id, {
      include: Product,
    });

    if (userWithPosts.Products.length != 0) {
      res.send({
        msg: "Product Fetched fetched!!",
        data: userWithPosts.Products,
      });
    } else {
      res.send("You don't have any product");
    }
  } catch {
    res.send("You don't have any product");
  }
};

exports.get_products = async (req, res) => {
  try {
    const result = await Product.findAll();
    res.send({
      msg: "Product Fetched fetched!!",
      count: result.length,
      result,
    });
  } catch {
    res.send("not fetchjed");
  }
};

exports.getProductByCategory = async (req, res) => {
  try {
    const product = await Product.findAll({
      where: { category: req.query.categoryName },
    });
    if (!product.length) {
      res.send({msg:"Don't have product with this category",status:"Sucess"}).status(404);
    }
    res.send({ msg: "Product Fetched!", product });
  } catch (error) {
    res.send({msg:"Internal Server Error",status:"Failure"}).status(505);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      req.headers.authorization?.split(" ")[1];

    const decode = jwt.verify(token, secretKey);

    const seller = await Seller.findOne({ where: { id: decode.userId } });
    const deletePr = await Product.findOne({ where: { id: req.body.id } });
    if (adminEmail == seller.email || seller.id == decode.userId) {
      await deletePr.destroy();
    }
    res.send({msg:"Product Delete Succesfully",status:"Sucess"}).status(200);
  } catch (err) {
    console.log(err, "errorrr");
    res.send("You don't have any product");
  }
};
