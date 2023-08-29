const {
  models: { userDetail, Product, addCart },
} = require("../models");

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const secretKey = process.env.JWT_SECRET_KEY;

exports.handle_cart = async (req, res) => {
  try {
    let payload = { userId: null };
    let itemsList = [];
    const token =
      req.body.token ||
      req.query.token ||
      req.headers.authorization?.split(" ")[1];

    if (token) {
      const decode = jwt.verify(token, secretKey); // Replace with your secret key
      const expirationTime = decode.exp;

      if (Date.now() >= expirationTime * 1000) {
        return res.status(401).json({ message: "Token has expired" });
      }
      payload.userId = decode.userId;
    }

    const { productName, tempId } = req.body;

    if (!productName) {
      return res.status(400).json({ msg: "productName is Required." });
    }
    const isProduct = await Product.findOne({
      where: { productName: productName },
    });

    if (!isProduct) {
      return res.status(404).send({ msg: "Product not exist!!." });
    }

    itemsList = [isProduct.id];

    payload = {
      ...payload,
      items: itemsList,
      gst: null,
      quantity: 0,
      totalAmount: null,
      quantity: itemsList.length,
    };

    let istempId;
    if (tempId) {
      istempId = await addCart.findByPk(tempId);
      if (!istempId) {
        return res.status(404).send({ msg: "TempId not exist!!." });
      }
      if (!istempId.items.length || !istempId.items.includes(isProduct.id)) {
        let addInCart = [...istempId.items, isProduct.id];
        await addCart.update(
          {
            items: addInCart,
          },
          {
            where: {
              id: istempId.id,
            },
          },
        );
        return res.status(200).send({
          message: "prodcut save sucessfully in AddCart",
          result: addInCart,
        });
      }
      res.status(200).send({
        message: "Prodcut is Already Add in cart.",
        result: istempId,
      });
    } else {
      const addInCart = await addCart.create({
        ...payload,
      });
      res.status(200).send({
        message: "Prodcut save sucessfully in AddCart",
        result: addInCart,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error adding category" });
  }
};
