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
    const { productName, description, category, price, inStock, discount } =
      req.body;

    const seller = await userDetail.findOne({
      where: { id: req.decode.userId },
    });

    const categoryNm = await ProductCategories.findOne({
      where: { categoryName: category },
    });

    if (!categoryNm) {
      return res.status(400).send({ message: "Invalid ProductCategories" });
    }
    if (!seller.isSeller) {
      return res
        .send({ msg: "You are not a verified seller", status: "Failure" })
        .status(400);
      }
      let payload = {
        productName,
        description,
        categoryId: categoryNm.id,
        price,
        inStock,
        productImage: null,
        discount: discount,
        sellerId: seller.id,
      };

    let result
    if(!req.file.path){
      result = await fileUpload.fileUpload(req.file.path);
      payload.productImage = result.secure_url
    }

    data = await Product.create(payload);

    return res.send({ message: "Product save sucessfully", result: data }).status(200);
  } catch (err) {
    console.log(err, "err");
    return res
      .send({ msg: "Internal Server Error", status: "Failure" })
      .status(505);
  }
};

exports.getsellerProduct = async (req, res) => {
  try {
    const seller = await userDetail.findOne({
      where: { id: req.decode.userId },
    });
    const userWithPosts = await Product.findAll({
      where: { sellerId: seller.id },
    });
    if (userWithPosts.length != 0) {
      return res.send({
        msg: "Product Fetched fetched!!",
        data: userWithPosts,
      });
    } else {
      return res.send("You don't have any product");
    }
  } catch {
    return res.send({ msg: "Internal Server Error", status: "Failure" }).status(505);
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

    let result;
    try {
      result = await Product.findAll({
        attributes: {exclude : ['createdAt','updatedAt']},
        include:[{model:ProductCategories, attributes : ["categoryName"]}],
        order: [["views", "DESC"]],
        where: whereClause,
      });
    } catch (error) {
      console.log(error);
      return res.send({msg: `${error}`})
    }
    res.send({
      msg: result?"Product Fetched fetched!!":"Prodcuts Not Found.",
      count: result?.length?result.length:0,
      data: result?result:[],
    });
  } catch (err) {
    res.send({ msg: `${err}`, status: "Failure" }).status(505);
  }
};

exports.get_product_details = async (req, res) => {
  try {
    let productId = req.params.id;
    console.log(req.body);
    if (!productId) {
      return res
        .status(400)
        .send({ msg: "productId is required.", status: "Failure" });
    }
    const isProductId = await Product.findOne({ where: { id: productId } });
    if (!isProductId) {
      return res.status(200).send({
        data: [],
        msg: "Product is not available.",
        status: "success",
      });
    }
    isProductId.views += 1;
    isProductId.save();
    return res.status(200).send({ data: [isProductId], status: "success" });
  } catch (err) {
    console.log(err);
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
    const seller = await userDetail.findOne({
      where: { id: req.decode.userId },
    });
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
