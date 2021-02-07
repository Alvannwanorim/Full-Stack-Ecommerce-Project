import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    res.status(400);
    throw new Error("Unauthorized User");
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded) {
    res.status(400);
    throw new Error("User Authentication Failed");
  }

  req.user = decoded.user;
  next();
};

export const adminUser = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("User not Authorized");
  }
};
