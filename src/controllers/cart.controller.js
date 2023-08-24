const {
    models: { userDetail, Product , addCart},
  } = require("../models");
  
  exports.handle_cart = async (req, res) => {
    try {
      const productName = req.body;
      if (!productName) {
        return res.status(400).json({ msg: "productName is Required." });
      }
      const result = await Product.findOne({ where:{productName:productName}});
      if(!result){
        return res.status(404).send({msg : "Product not exist!!."})
      }
      const items = []
      const payload = {userId :null, items : items.push(result.id)}
      if(req.decode.userId){
          payload.userId = req.decode.userId;
      }
      const calucuateGst = Number(result.price) * 18 / 100
      const totalAmount = calucuateGst + Number(result.price)
      const cartData = await addCart.create({...payload,gst:calucuateGst,totalAmount:totalAmount, quantity: items.length})
        res.status(200).send({
          message: "prodcut save sucessfully in AddCart",
          result: cartData,
      })
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Error adding category" });
    }
  };
  