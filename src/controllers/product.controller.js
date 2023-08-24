const dotenv = require("dotenv");
dotenv.config();
const { Op } = require("sequelize");
const {
  models: { userDetail, ProductCategories, Product },
} = require("../models");

const adminEmail = process.env.AdminEmail;

const fileUpload = require("../config/fileConfig");

exports.create = async (req, res) => {
  try {
    const { productName, description, category, price, inStock } = req.body;


    const seller = await userDetail.findOne({ where: { id: req.decode.userId } });

    const categoryNm = await ProductCategories.findOne({
      where: { categoryName: category },
    });

    if (!categoryNm.categoryName) {
      res.send({ message: "Invalid ProductCategories" });
    }
    if (!seller.isVerified) {
      res.send({ msg: "You are not a verified seller", status: "Failure" }).status(400);
    }
      const result = await fileUpload.fileUpload(req.file.path);

      const payload = {
        productName,
        description,
        category,
        price,
        inStock,
        productImage: result.secure_url,
        sellerId: seller.id,
      };

      data = await Product.create(payload);

      res
        .send({ message: "Product save sucessfully", result: data })
        .status(200);
  } catch (err) {
    console.log(err, "err");
    res.send({ msg: "Internal Server Error", status: "Failure" }).status(505);

  }
};

exports.getsellerProduct = async (req, res) => {
  try {

    const seller = await userDetail.findOne({ where: { id: req.decode.userId } });
    console.log("jns");
    const userWithPosts = await Product.findAll({where:{sellerId: seller.id}});
    console.log(userWithPosts);
    if (userWithPosts.length != 0) {
      res.send({
        msg: "Product Fetched fetched!!",
        data: userWithPosts,
      });
    } else {
      res.send("You don't have any product");
    }
  } catch {
    res.send({ msg: "Internal Server Error", status: "Failure" }).status(505);

  }
};

exports.get_products = async (req, res) => {
  try {
    const filters = req.query;
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
  } catch (err) {
   res.send({ msg: "Internal Server Error", status: "Failure" }).status(505);
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
   
    const seller = await userDetail.findOne({ where: { id: req.decode.userId } });
    const deletePr = await Product.findOne({ where: { id: req.body.id } });
    if (adminEmail == seller.email || seller.id == req.decode.userId) {
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
