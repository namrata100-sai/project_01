import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Constraction_data", // Adjust if your User model name is different
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products", // your Product model
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      costPrice: {
        type: Number,
        required: true,
        min: 0,
      },
    },
  ],
  
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  orderId: {
    type: String,
    required: true,
    unique: true, // Ensures one PayPal order is not duplicated
  },
  status: {
    type: String,
    enum: ["Paid", "Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Paid",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("orders", orderSchema);
