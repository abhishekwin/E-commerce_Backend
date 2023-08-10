const Category = require("../models/category.model");
const User = require("../models/user.model");

require("../models/assosiations");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();
const secretKey = process.env.JWT_SECRET_KEY;

const adminEmail = process.env.AdminEmail;
exports.addCategory = async (req, res) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      req.headers.authorization?.split(" ")[1];

    const decode = jwt.verify(token, secretKey);
    const admn = await User.findOne({ where: { id: decode.userId } });
    if (adminEmail != admn.email) {
      return res.status(409).send("You are not a Admin");
    } else {
      const category = await Category.create(req.body);
      res.send({ message: "Category save sucessfully", result: category });
    }
  } catch (err) {
    res.status(500).json({ error: "Error adding category" });
  }
};

exports.get_allCategory = async (req, res) => {
  try {
    const categoryies = await Category.findAll();
    res.status(200).send(categoryies);
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      req.headers.authorization?.split(" ")[1];

    const decode = jwt.verify(token, secretKey);
    const categoryId = req.body.categoryName;
    const category = await Category.findOne({
      where: { categoryName: categoryId },
    });
    if (!category) {
      res.send({ message: "There is no Category " });
    }
    const admn = await User.findOne({ where: { id: decode.userId } });

    if (adminEmail != admn.email) {
      return res.status(409).send("You are not a Admin");
    }
    category.destroy();
    res
      .send({ message: "Category Delete sucessfully", result: category })
      .status(200);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error deleting category" });
  }
};
