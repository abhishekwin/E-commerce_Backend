const dotenv = require("dotenv");
dotenv.config();
const { Op } = require("sequelize");
const {
  models: { userDetail, ProductCategories, Product },
} = require("../models");

const adminEmail = process.env.AdminEmail;

const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET_KEY;

const fileUpload = require("../config/fileConfig");

exports.create = async (req, res) => {
  try {
    const { productName, description, category, price, inStock } = req.body;
    const token =
      req.body.token ||
      req.query.token ||
      req.headers.authorization?.split(" ")[1];
    const decode = jwt.verify(token, secretKey);

    const seller = await userDetail.findOne({ where: { id: decode.userId } });

    const categoryNm = await ProductCategories.findOne({
      where: { categoryName: category },
    });

    if (!categoryNm.categoryName) {
      res.send({ message: "Invalid ProductCategories" });
    }
    if (seller.isVerified) {
      const result = await fileUpload.fileUpload(req.file.path);

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
    const seller = await userDetail.findOne({ where: { id: decode.userId } });

    const userWithPosts = await userDetail.findByPk(seller.id, {
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
    const filters = req.query; // Get query parameters from request
    // Construct the filters using Sequelize's Op objects
    const whereClause = {};
    if (filters.category) {
      whereClause.category = filters.category;
    }
    if (filters.priceMin && filters.priceMax) {
      whereClause.price = {
        [Op.between]: [filters.priceMin, filters.priceMax],
      };
    }
    if (filters.inStock) {
      whereClause.inStock = {
        [Op.gte]: [filters.inStock],
      };
    }
    const result = await Product.findAll({ where: whereClause });
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
      res
        .send({
          msg: "Don't have product with this category",
          status: "Sucess",
        })
        .status(404);
    }
    res.send({ msg: "Product Fetched!", product });
  } catch (error) {
    res.send({ msg: "Internal Server Error", status: "Failure" }).status(505);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      req.headers.authorization?.split(" ")[1];

    const decode = jwt.verify(token, secretKey);

    const seller = await userDetail.findOne({ where: { id: decode.userId } });
    const deletePr = await Product.findOne({ where: { id: req.body.id } });
    if (adminEmail == seller.email || seller.id == decode.userId) {
      await deletePr.destroy();
    }
    res
      .send({ msg: "Product Delete Succesfully", status: "Sucess" })
      .status(200);
  } catch (err) {
    console.log(err, "errorrr");
    res.send("You don't have any product");
  }
};
