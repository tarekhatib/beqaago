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
    res.json(await getUserOrdersFromDb(req.params.userId));
  } catch (err) {
    console.error("❌ Error fetching user orders:", err.message);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};


// CREATE ORDER + AUTO UPDATE (Pending → Preparing → Delivered)

export const createOrder = async (req, res) => {
  try {
    const { user_id, shop_id, total, items } = req.body;
    if (!user_id || !shop_id || !total || !items || !items.length) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // 1️⃣ Get last user_order_number
    const [[row]] = await db.query(
      `SELECT COALESCE(MAX(user_order_number), 0) AS lastNum
       FROM orders
       WHERE user_id = ?`,
      [user_id]
    );

    const nextOrderNum = row.lastNum + 1;
// 1️⃣ Get last vendor order number
const [[shopRow]] = await db.query(
  `SELECT COALESCE(MAX(vendor_order_number), 0) AS lastShopNum
   FROM orders
   WHERE shop_id = ?`,
  [shop_id]
);

const nextVendorOrderNum = shopRow.lastShopNum + 1;

// 2️⃣ Insert with vendor_order_number included
const [result] = await db.query(
  `INSERT INTO orders (user_id, shop_id, total, status, user_order_number, vendor_order_number)
   VALUES (?, ?, ?, 'Pending', ?, ?)`,
  [user_id, shop_id, total, nextOrderNum, nextVendorOrderNum]
);

    const orderId = result.insertId;

    // 3️⃣ Insert order_items
    for (const item of items) {
      await db.query(
        `INSERT INTO order_items (order_id, item_id, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.item_id, item.quantity, item.price]
      );
    }

    // 4️⃣ Auto-status update
    setTimeout(() => updateOrderStatus(orderId, "Preparing"), 60000);  
    setTimeout(() => updateOrderStatus(orderId, "Delivered"), 120000); 

    res.status(201).json({ message: "Order created", orderId, user_order_number: nextOrderNum });

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
export const renderOrderDetails = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const [[order]] = await db.query(
      `SELECT o.*, u.id AS userId
       FROM orders o
       JOIN users u ON u.id = o.user_id
       WHERE o.id = ?`,
      [orderId]
    );

    if (!order) return res.status(404).send("Order not found");

    const [[shop]] = await db.query(
      `SELECT * FROM shops WHERE id = ?`,
      [order.shop_id]
    );

    const [items] = await db.query(
      `SELECT oi.*, si.name, si.image
       FROM order_items oi
       JOIN shop_items si ON oi.item_id = si.id
       WHERE oi.order_id = ?`,
      [orderId]
    );

    const [[countRow]] = await db.query(
      `SELECT COUNT(*) AS count FROM orders WHERE user_id = ?`,
      [order.user_id]
    );

    const itemsTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const deliveryFee = countRow.count <= 3 ? 0 : Number(shop.delivery_fee || 0);
    const finalTotal = itemsTotal + deliveryFee;

    res.render("orderDetails", {
      page: "orders",   // 🔥 FIXED
      order,
      shop,
      items,
      totals: {
        itemsTotal,
        deliveryFee,
        finalTotal
      }
    });

  } catch (err) {
    console.error("❌ renderOrderDetails:", err);
    res.status(500).send("Server error");
  }
};
