import cloudinary from "cloudinary";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const upload = async (req, res) => {
  let result = await cloudinary.v2.uploader.upload(req.body.image, {
    folder: "brad-ecommerce",
  });

  res.json({ public_id: result.public_id, url: result.secure_url });
};

export const removeImage = (req, res) => {
  let image_id = req.body.public_id;

  cloudinary.v2.uploader.destroy(image_id, (err, result) => {
    if (err) return res.json({ success: false, err });
    res.send("File delete successful");
  });
};
