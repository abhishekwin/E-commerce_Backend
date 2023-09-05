'use strict';

const {
  models: { ProductCategories },
} = require("../models");

module.exports = {
  up:async (queryInterface, Sequelize) => {

    try {
      const existingCategories = await ProductCategories.findAll();
      if (existingCategories.length === 0) {

        return queryInterface.bulkInsert('productCategories', [
          {
            categoryName: "Mobile",
            categoryImage: "https://res.cloudinary.com/dvrx7p7im/image/upload/v1692941453/l4xdosbc92mszwkk3dub.jpg",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            categoryName: "Electronic",
            categoryImage: "https://res.cloudinary.com/dvrx7p7im/image/upload/v1692957668/q5zgjtk03cr1uthpufoj.png",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            categoryName: "Fashion",
            categoryImage: "https://res.cloudinary.com/dvrx7p7im/image/upload/v1692957822/zijwxldvih0z9erkjas3.jpg",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            categoryName: "Furniture",
            categoryImage: "https://res.cloudinary.com/dvrx7p7im/image/upload/v1692957890/fxcndaaa1kp5otn7qfdp.jpg",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
    
            categoryName: "Candy",
            categoryImage: "https://res.cloudinary.com/dvrx7p7im/image/upload/v1693295126/ptsrltg51gyqiybb0te7.jpg",
            createdAt: new Date(),
            updatedAt: new Date(),
        }
        ]);

      } else {
        console.log('Data already exists in the Categories table. Skipping seeding.');
      }
    } catch (error) {
      console.error('Error seeding users:', error);
    }

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('productCategories', null, {});
  },
};
