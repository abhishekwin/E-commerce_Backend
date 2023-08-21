const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");

exports.upload = multer({ dest: "uploads/" });

exports.fileUpload = async (file) => {
  cloudinary.config({
    cloud_name: process.env.Cloud_Name,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });

  const result = await cloudinary.uploader.upload(file);

  return result;
};
