import db from "../config/db.js";
import {
  updateOrderStatus,
  getUserOrdersFromDb,
  getVendorOrdersFromDb,
  getShopStatsFromDb,
  getRecentOrdersFromDb
} from "../models/order.model.js";

// USER – orders
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;

    const [rows] = await db.query(
      `
      SELECT 
        o.id,
        o.total,
        o.status,
        o.created_at,
        s.name AS shop_name
      FROM orders o
      JOIN shops s ON o.shop_id = s.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
      `,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching user orders:", err.message);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};


// CREATE ORDER + AUTO UPDATE (Pending → Preparing → Delivered)
export const createOrder = async (req, res) => {
  try {
    const { user_id, shop_id, total } = req.body;

    if (!user_id || !shop_id || !total) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const [result] = await db.query(
      `INSERT INTO orders (user_id, shop_id, total, status)
       VALUES (?, ?, ?, 'Pending')`,
      [user_id, shop_id, total]
    );

    const orderId = result.insertId;

    // After 1 minute → Preparing
    setTimeout(async () => {
      await updateOrderStatus(orderId, "Preparing");
      console.log(`Order ${orderId} → Preparing`);
    }, 60 * 1000);

    // After 2 minutes → Delivered
    setTimeout(async () => {
      await updateOrderStatus(orderId, "Delivered");
      console.log(`Order ${orderId} → Delivered`);
    }, 120 * 1000);

    res.status(201).json({ message: "Order created", orderId });

  } catch (err) {
    console.error("❌ createOrder:", err);
    res.status(500).json({ message: "Database error" });
  }
};

// VENDOR – orders (for one vendor's shops)
export const getVendorOrders = async (req, res) => {
  try {
    const vendorUserId = req.params.vendorUserId;
    const rows = await getVendorOrdersFromDb(vendorUserId);
    res.json(rows);
  } catch (err) {
    console.error("❌ getVendorOrders:", err);
    res.status(500).json({ message: "Database error" });
  }
};

// VENDOR – shop stats
export const getShopOrderStats = async (req, res) => {
  try {
    const shopId = req.params.shopId;
    const stats = await getShopStatsFromDb(shopId);
    res.json(stats);
  } catch (err) {
    console.error("❌ getShopOrderStats:", err);
    res.status(500).json({ message: "Database error" });
  }
};

// VENDOR – recent orders for one shop
export const getRecentOrdersForShop = async (req, res) => {
  try {
    const shopId = req.params.shopId;
    const rows = await getRecentOrdersFromDb(shopId);
    res.json(rows);
  } catch (err) {
    console.error("❌ getRecentOrdersForShop:", err);
    res.status(500).json({ message: "Database error" });
  }
};
