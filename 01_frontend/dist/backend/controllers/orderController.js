import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js"; // Make sure this is imported
import mongoose from "mongoose";



export const saveOrderController = async (req, res) => {
  try {
    const { userId, cart, totalAmount, orderId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    // Attach costPrice from product for each cart item
    const products = await Promise.all(
      cart.map(async (item) => {
        const product = await productModel.findById(item._id).select("costPrice");
        return {
          product: item._id,
          quantity: item.quantity,
          costPrice: product?.costPrice || 0,
        };
      })
    );

    const order = await orderModel.create({
      user: userId,
      products,
      totalAmount,
      orderId,
    });

    res.status(201).json({ success: true, order });
  } catch (err) {
    console.error("Error saving order:", err);
    res.status(500).json({ success: false, message: "Failed to save order" });
  }
};


// Get user orders
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("Fetching orders for user:", userId);

    const userOrders = await orderModel.find({ user: userId }).populate("products.product");

    console.log("Fetched Orders:", userOrders);
    res.json({ orders: userOrders });
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Unable to fetch orders" });
  }
};

// Get all orders for admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("user", "name email") // only bring name & email
      .populate("products.product", "name price") // product name & price
      .sort({ createdAt: -1 }); // latest first

    res.status(200).send({
      success: true,
      message: "✅ All orders fetched successfully",
      orders: orders.map(order => ({
        orderId: order.orderId,
        user: order.user ? order.user.name : "Unknown User",
        email: order.user ? order.user.email : "No Email",
        products: order.products.map(p => ({
          name: p.product?.name || "Unknown Product",
          price: p.product?.price || 0,
          quantity: p.quantity,
        })),
        totalAmount: order.totalAmount,
        status: order.status,
        orderedAt: order.createdAt,
      })),
    });
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ 
      success: false,
      message: "❌ Unable to fetch orders",
      error: err.message,
    });
  }
};




// controllers/adminController.js
export const getProfitController = async (req, res) => {
  try {
    const orders = await orderModel.find().populate("products.product");

    let totalRevenue = 0;
    let totalCost = 0;
    let totalProfit = 0;

    const productMap = new Map();

    for (const order of orders) {
      for (const item of order.products) {
        const product = item.product;
        const quantity = item.quantity;
        const sellingPrice = product.price;
        const costPrice = product.costPrice;

        const revenue = sellingPrice * quantity;
        const cost = costPrice * quantity;
        const profit = revenue - cost;

        totalRevenue += revenue;
        totalCost += cost;

        const key = product._id.toString();

        if (!productMap.has(key)) {
          productMap.set(key, {
            name: product.name,
            quantitySold: 0,
            sellingPrice,
            costPrice,
            totalRevenue: 0,
            totalCost: 0,
            profit: 0,
          });
        }

        const entry = productMap.get(key);
        entry.quantitySold += quantity;
        entry.totalRevenue += revenue;
        entry.totalCost += cost;
        entry.profit += profit;

        productMap.set(key, entry);
      }
    }

    totalProfit = totalRevenue - totalCost;
    const productBreakdown = Array.from(productMap.values());

    res.status(200).send({
      success: true,
      revenue: totalRevenue,
      cost: totalCost,
      profit: totalProfit,
      productBreakdown, // send this to frontend
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error calculating profit",
      error: error.message,
    });
  }
};

