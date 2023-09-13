const {
  models: { userDetail, Product, addCart },
} = require("../models");

const Sequelize = require('sequelize');
const { Op } = Sequelize;

exports.handle_cart = async (req, res) => {
  try {
    //addition variable
    let istempId;
    
    let userId = req.decode?.userId?req.decode.userId:null;
    let tempId =  req.body.tempId   
    let { productName, quantity } = req.body;

    if (!productName) {
      return res.status(500).json({ msg: "productName is Required." });
    }
    const isProduct = await Product.findOne({
      where: { productName: productName },
    });

    if (!isProduct) {
      return res.status(404).send({ msg: "Product not exist!!." });
    }
    
    //define payload
    let payload = {
      userId: null,
      items: [isProduct.id],
      gst: null,
      totalAmount: null,
      quantity: 0,
      discount: 0,
    };

    let cart_products = [];

    if (userId || !tempId){
      if(userId){
        istempId = await addCart.findOne({where :{userId: userId}})
        if(istempId){
          tempId = istempId.id
        }
      }
    }

    if ((!tempId && userId) || (!tempId && !userId)) {
      payload.userId = userId ? userId : null;
      istempId = await addCart.create({ ...payload });
      cart_products = [isProduct];
    }

    if (tempId) {
      istempId = await addCart.findOne({
        where:  { id: tempId }
      });
      istempId.userId = userId ? userId : null;
      if (
        !istempId.items.length ||
        !istempId.items.includes(`${isProduct.id}`)
      ) {
        istempId.items = [...istempId.items, `${isProduct.id}`]; //ADD PRODUCT IN ITEMS LIST
        await istempId.save();
      }

      let data = await Product.findAll({ where: { id: istempId.items } });
      cart_products = [...cart_products, ...data];
    }

    cart_products.forEach((product) => {
      payload.discount += Math.round(((product.price ) * product.discount) / 100);
      payload.totalAmount +=
        product.price - Math.round((product.price * product.discount) / 100);
    });

    istempId.discount = payload.discount;
    istempId.totalAmount = payload.totalAmount;

    return res.status(200).send({
      message: "Prodcut added sucessfully in AddCart",
      result: istempId,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error adding category" });
  }
};

exports.remove_product_in_cart = async (req, res) => {
  try {
    let { productName, tempId } = req.body;
    if (!productName) {
      return res.status(400).json({ msg: "productName is Required." });
    }
    const isProduct = await Product.findOne({
      where: { productName: productName },
    });
    if (!isProduct) {
      return res.status(404).send({ msg: "Product not exist!!." });
    }

    let cart_products = [];

    let istempId = await addCart.findByPk(tempId);

    if (!istempId) {
      return res.status(404).send({ msg: "TempId not exist!!." });
    }

    if (!istempId.items.length || !istempId.items.includes(`${isProduct.id}`)) {
      return res.status(200).send({
        message: "Does not have Product in AddCart",
        result: istempId,
      });
    }
      
    istempId.items = istempId.items.filter(
      (value) => value !== `${isProduct.id}`,
      );     
    await istempId.save();
      
    let payload = {
      userId: null,
      items: [isProduct.id],
      gst: null,
      totalAmount: null,
      quantity: 0,
      discount: 0,
    };

    let _products = await Product.findAll({ where: { id: istempId.items } });
  
    cart_products = [...cart_products, ..._products];
    cart_products.forEach((product) => {
      payload.discount += Math.round((product.price * product.discount) / 100);
      payload.totalAmount +=
        product.price - Math.round((product.price * product.discount) / 100);
    });
    
    istempId.discount = payload.discount;
    istempId.totalAmount = payload.totalAmount;

    return res.status(200).send({
      message: "Product deleted Successfully",
      result: istempId,
    });
  } catch (error) {
    return res.status(500).send({
      message: `${error}`,
    });
  }
};

exports.getcart = async (req, res) =>{
   try{
    const tempId = req.query.tempId || req.body.tempId
    if (!tempId) {
      return res.status(500).json({ msg: "tempId is Required." });
    }
    let istempId = await addCart.findOne({
      where:  { id: tempId }
    });
    if (!istempId) {
      return res.status(500).json({ msg: "istempId is not exist`  ." });
    }
    let cart_products = [];

    let payload = {
      userId: null,
      items: [],
      gst: null,
      totalAmount: null,
      quantity: 0,
      discount: 0,
    };
    let _products = await Product.findAll({ where: { id: istempId.items } });
  
    cart_products = [...cart_products, ..._products];
    cart_products.forEach((product) => {
      payload.discount += Math.round((product.price * product.discount) / 100);
      payload.totalAmount +=
        product.price - Math.round((product.price * product.discount) / 100);
    });
    istempId.discount = payload.discount;
    istempId.totalAmount = payload.totalAmount;

    return res.status(200).send({
      message: "tempId data!!",
      result: istempId?[istempId]:[],
    });

  } catch (error) {
    return res.status(500).send({
      message: `${error}`,
    });
  }
}