import express from "express";
import {
  getUserOrders,
  getVendorOrders,
  createOrder,
  getShopOrderStats,
  getRecentOrdersForShop
} from "../controllers/order.controller.js";

const router = express.Router();

// Vendor Full Orders List
router.get("/vendor/:vendorUserId", getVendorOrders);

// Vendor Stats & Recent Orders
router.get("/stats/:shopId", getShopOrderStats);
router.get("/recent/:shopId", getRecentOrdersForShop);

// User Orders
router.get("/:userId", getUserOrders);

// Create order
router.post("/", createOrder);

export default router;
