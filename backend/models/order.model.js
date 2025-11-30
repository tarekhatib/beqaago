import db from "../config/db.js";

export const updateOrderStatus = async (orderId, status) => {
  await db.query("UPDATE orders SET status = ? WHERE id = ?", [status, orderId]);
};

export const getUserOrdersFromDb = async (userId) => {
  const [rows] = await db.query(
    `
    SELECT 
      o.id,
      o.total,
      o.status,
      o.created_at,
      s.name AS shop
    FROM orders o
    JOIN shops s ON o.shop_id = s.id
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC
    `,
    [userId]
  );
  return rows;
};

export const getVendorOrdersFromDb = async (vendorUserId) => {
  const [rows] = await db.query(
    `
    SELECT 
      o.id,
      o.total,
      o.status,
      o.created_at,
      u.name AS customer,
      s.name AS shop
    FROM orders o
    JOIN shops s ON o.shop_id = s.id
    JOIN users u ON o.user_id = u.id
    WHERE s.user_id = ?
    ORDER BY o.created_at DESC
    `,
    [vendorUserId]
  );
  return rows;
};

export const getShopStatsFromDb = async (shopId) => {
  const [[total]] = await db.query(
    "SELECT COUNT(*) AS total FROM orders WHERE shop_id = ?",
    [shopId]
  );
  const [[today]] = await db.query(
    `
    SELECT COUNT(*) AS today
    FROM orders
    WHERE shop_id = ?
      AND DATE(created_at) = CURDATE()
    `,
    [shopId]
  );
  return { total: total.total, today: today.today };
};

export const getRecentOrdersFromDb = async (shopId) => {
  const [rows] = await db.query(
    `
    SELECT id, total, status, created_at
    FROM orders
    WHERE shop_id = ?
    ORDER BY created_at DESC
    LIMIT 10
    `,
    [shopId]
  );
  return rows;
};
