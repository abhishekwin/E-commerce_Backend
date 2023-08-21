const {
  models: { userDetail, ProductCategories },
} = require("../models");

const dotenv = require("dotenv");
dotenv.config();

const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET_KEY;

const adminEmail = process.env.AdminEmail;
const fileUpload = require(".././config/fileConfig");

exports.addCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;
    if (!categoryName) {
      return res.status(400).json({ msg: "Pass Required Details." });
    }
    const admn = await userDetail.findOne({ where: { id: req.decode.userId } });
    if (adminEmail != admn.email) {
      return res.status(409).send("You are not a Admin");
    } else {
      const result = await fileUpload.fileUpload(req.file.path);
      const category = await ProductCategories.create({
        categoryName: categoryName,
        categoryImage: result.secure_url,
      });
      res.send({
        message: "ProductCategories save sucessfully",
        result: category,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error adding category" });
  }
};

exports.get_allCategory = async (req, res) => {
  try {
    const categoryies = await ProductCategories.findAll();
    res.status(200).send(categoryies);
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.deleteCategory = async (req, res) => {
  try {

    const categoryId = req.body.categoryName;
    const category = await ProductCategories.findOne({
      where: { categoryName: categoryId },
    });
    if (!category) {
      return res.send({ message: "There is no ProductCategories " });
    }
    const admn = await userDetail.findOne({ where: { id: req.decode.userId } });

    if (adminEmail != admn.email) {
      return res.status(409).send("You are not a Admin");
    }
    category.destroy();
    res
      .send({
        message: "ProductCategories Delete sucessfully",
        result: category,
      })
      .status(200);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error deleting category" });
  }
};
