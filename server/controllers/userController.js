import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

//@desc Auth user & get token
//@route POST /ap/user/login
//@acess Public
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw Error("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(400);
    throw new Error("password incorrect");
  }

  const payload = {
    user: {
      id: user._id,
      isAdmin: user.isAdmin,
      name: user.name,
    },
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });

  res.json({
    token,
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

//@desc Register user & get token
//@route POST /ap/user/register
//@acess Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Name is required");
  }
  if (!email) {
    res.status(400);
    throw new Error("Email is required");
  }

  if (!password) {
    res.status(400);
    throw new Error("Password is required");
  }
  const existUser = await User.findOne({ email });

  if (existUser) {
    res.status(400);
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);

  const hashPassword = await bcrypt.hash(password, salt);

  const user = new User({ email, name, password: hashPassword });

  await user.save();

  const payload = {
    user: {
      id: user._id,
      isAdmin: user.isAdmin,
      name: user.name,
    },
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });

  res.json({
    token,
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

//@desc Get User Profile
//@route GET /ap/user/profile
//@acess Private

export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

//@desc Update User Profile
//@route PUT /ap/user/profile
//@acess Private

export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      const password = req.body.password;
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      user.password = hashPassword || user.password;
    }
    const updatedUser = await user.save();

    const payload = {
      user: {
        id: updatedUser._id,
        isAdmin: user.isAdmin,
        name: user.name,
      },
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res.json({
      token,
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//@desc Get all users
//@route GET /ap/user/profile
//@acess Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();

  res.json(users);
});

//@desc Delete  user
//@route DELETE /ap/user/:id
//@acess Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.remove();
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//@desc Get user by ID
//@route GET /ap/user/:id
//@acess Private/Admin
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//@desc Update User Profile
//@route PUT /ap/user/profile
//@acess Private

export const updateUserByAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
