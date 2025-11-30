import db from "../config/db.js";

export const getAllShops = async () => {
  const [rows] = await db.query("SELECT * FROM shops");
  return rows;
};

export const searchShops = async (q) => {
  const like = `%${q}%`;
  const [rows] = await db.query(
    "SELECT * FROM shops WHERE name LIKE ? OR location LIKE ?",
    [like, like]
  );
  return rows;
};

export const getShopById = async (id) => {
  const [rows] = await db.query("SELECT * FROM shops WHERE id = ?", [id]);
  return rows[0];
};

export const getShopByOwnerId = async (userId) => {
  const [rows] = await db.query("SELECT * FROM shops WHERE user_id = ?", [userId]);
  return rows[0];
};

export const createShop = async (userId, name, type, phone, location, image) => {
  const [result] = await db.query(
    `INSERT INTO shops (user_id, name, type, phone, location, image, is_open)
     VALUES (?, ?, ?, ?, ?, ?, 1)`,
    [userId, name, type || "restaurant", phone, location, image]
  );
  return result.insertId;
};

export const updateShopForOwner = async (userId, { name, type, phone, location, image }) => {
  await db.query(
    `UPDATE shops
     SET name = ?, type = ?, phone = ?, location = ?, image = ?
     WHERE user_id = ?`,
    [name, type || "restaurant", phone, location, image, userId]
  );
};

export const updateShopAvailabilityForOwner = async (userId, isOpen) => {
  await db.query(
    "UPDATE shops SET is_open = ? WHERE user_id = ?",
    [isOpen, userId]
  );
};

export const updateShopStatusById = async (id, isOpen) => {
  await db.query(
    "UPDATE shops SET is_open = ? WHERE id = ?",
    [isOpen, id]
  );
};
