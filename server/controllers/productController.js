import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

//@desc Fetch all products
//@route Get /api/products
//@acess Public
export const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 4;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};
  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

//@desc Fetch single products
//@route Get /api/products/:id
//@acess Public
export const getPorductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json(product);
});

//@desc Delete product By Id
//@route DELETE /api/products/:id
//@acess Private/Admin
export const deletePorductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.remove();
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

//@desc Create Product
//@route POST /api/products/
//@acess Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    image,
    brand,
    category,
    countInStock,
    numReviews,
    description,
  } = req.body;

  const product = new Product({
    name,
    price,
    user: req.user.id,
    image,
    brand,
    category,
    countInStock,
    numReviews,
    description,
  });
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

//@desc Update Product
//@route POST /api/products/:id
//@acess Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    user,
    image,
    brand,
    category,
    countInStock,
    numReviews,
    description,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.status(201).json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

//@desc Create new reviews
//@route POST /api/products/reviews
//@acess Private
export const createProductReviews = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user.id.toString()
    );
    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed by user");
    }
    const review = {
      user: req.user.id,
      rating: Number(rating),
      comment,
      name: req.user.name,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => acc + item.rating, 0) /
      product.numReviews;
    await product.save();
    res.status(201).json({ message: "Reviews created" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

//@desc Get Top Rated Products
//@route GET /api/products/top
//@acess Public
export const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);
  res.json(products);
});
