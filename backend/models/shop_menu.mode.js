// backend/models/shop_menu.model.js
import db from "../config/db.js";

export const getMenuByShopId = async (shopId) => {
  const [rows] = await db.query(
    "SELECT * FROM shop_menu WHERE shop_id = ?",
    [shopId]
  );
  return rows;
};

export const createMenuItem = async (shopId, name, price, image) => {
  await db.query(
    `INSERT INTO shop_menu (shop_id, item_name, price, image)
     VALUES (?, ?, ?, ?)`,
    [shopId, name, price, image]
  );
};

export const deleteMenuItemById = async (id) => {
  await db.query("DELETE FROM shop_menu WHERE id = ?", [id]);
};

export const updateMenuItem = async (id, name, price, image) => {
  await db.query(
    `UPDATE shop_menu 
     SET item_name = ?, price = ?, image = ?
     WHERE id = ?`,
    [name, price, image, id]
  );
};
