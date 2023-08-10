const Product = require("./product.model")
const Seller = require("./user.model")
const Category = require("./category.model")

// Define one-to-many association between Seller and Product
Seller.hasMany(Product, { foreignKey: 'sellerId' }); // One-to-many: User has many Posts
Product.belongsTo(Seller, { foreignKey: 'sellerId' }); // One-to-one: Post belongs to a User
