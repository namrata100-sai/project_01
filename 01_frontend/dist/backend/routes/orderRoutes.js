import express from "express";
import { 
  saveOrderController, 
  getUserOrders, 
  getAllOrders,
  getProfitController, 
  
} from "../controllers/orderController.js";  // Import the new controller
import { isAdmin, requireSignIn } from "../middlewares/authmiddleware.js";

const router = express.Router();

// Existing routes
router.post("/save", saveOrderController);  // save order after payment
router.get("/user/:id", getUserOrders);     // get user orders
router.get("/admin", getAllOrders);         // get all orders for admin

// New route for profit calculation
router.get("/admin/get-profit-report",   getProfitController);
export default router;
