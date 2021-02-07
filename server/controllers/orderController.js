import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";

//@desc Create new Orders
//@route POST /api/orders
//@acess Private
export const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    ItemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No orders found");
  } else {
    const order = new Order({
      orderItems,
      user: req.user.id,
      shippingAddress,
      paymentMethod,
      ItemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});

//@desc Get Order by Id
//@route GET /api/orders/:id
//@acess Private
export const getOrderItemById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.json(order);
});

//@desc Update Order by Id to Paid
//@route PUT /api/orders/:id/pay
//@acess Private
export const updateOrdeToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

//@desc Update Order by Id to Delievered
//@route PUT /api/orders/:id/deliver
//@acess Private
export const updateOrdeToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

//@desc Get logged in user orders
//@route GET /api/orders/myorders
//@acess Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const order = await Order.find({ user: req.user.id });
  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

//@desc Get all  orders
//@route GET /api/orders
//@acess Private/Admin
export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "id name");
  if (orders) {
    res.json(orders);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});
