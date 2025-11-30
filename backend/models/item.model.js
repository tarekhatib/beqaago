import db from "../config/db.js";

export const getItemsByShopId = async (shopId) => {
  const [rows] = await db.query(
    "SELECT * FROM shop_items WHERE shop_id = ?",
    [shopId]
  );
  return rows;
};

export const createItemForShop = async (shopId, name, description, price, image) => {
  await db.query(
    `INSERT INTO shop_items (shop_id, name, description, price, image)
     VALUES (?, ?, ?, ?, ?)`,
    [shopId, name, description, price, image]
  );
};

export const deleteItem = async (itemId) => {
  await db.query("DELETE FROM shop_items WHERE id = ?", [itemId]);
};
