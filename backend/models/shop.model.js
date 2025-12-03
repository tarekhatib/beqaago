import db from "../config/db.js";

/* ============================
   PUBLIC — list all shops
============================ */
export const getAllShops = async () => {
  const [rows] = await db.query(
    `SELECT s.*, c.name AS category_name, c.icon, c.color
     FROM shops s
     JOIN categories c ON c.id = s.category_id
     ORDER BY s.id DESC`
  );
  return rows;
};

/* ============================
   SEARCH
============================ */
export const searchShops = async (q) => {
  const like = `%${q}%`;
  const [rows] = await db.query(
    `SELECT s.*, c.name AS category_name, c.icon, c.color
     FROM shops s
     JOIN categories c ON c.id = s.category_id
     WHERE s.name LIKE ? OR s.location LIKE ?`,
    [like, like]
  );
  return rows;
};

/* ============================
   ONE SHOP
============================ */
export const getShopById = async (id) => {
  const [rows] = await db.query(
    `SELECT s.*, c.name AS category_name, c.icon, c.color
     FROM shops s
     JOIN categories c ON c.id = s.category_id
     WHERE s.id = ?`,
    [id]
  );
  if (rows[0]) {
    rows[0].delivery_fee = Number(rows[0].delivery_fee);
}
return rows[0];

};

/* ============================
   SHOP BY OWNER
============================ */
export const getShopByOwnerId = async (userId) => {
  const [rows] = await db.query(
    `SELECT s.*, 
            c.name AS category_name, c.icon, c.color
     FROM shops s
     JOIN categories c ON c.id = s.category_id
     WHERE s.user_id = ?`,
    [userId]
  );
  if (rows[0]) {
    rows[0].delivery_fee = Number(rows[0].delivery_fee);
}
return rows[0];

  
};

/* ============================
   CREATE SHOP
============================ */
export const createShop = async (
  userId,
  name,
  category_id,
  delivery_fee,
  phone,
  location,
  image
) => {
  const [result] = await db.query(
    `INSERT INTO shops 
    (user_id, category_id, name, delivery_fee, phone, location, image, is_open)
     VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
    [userId, category_id, name, delivery_fee, phone, location, image]
  );
  return result.insertId;
};

/* ============================
   UPDATE SHOP INFO
============================ */
export const updateShopForOwner = async (userId, data) => {
  const {
    name,
    category_id,
    delivery_fee,
    phone,
    location,
    image,
  } = data;

  await db.query(
    `
    UPDATE shops
    SET 
      name = ?, 
      category_id = ?, 
      delivery_fee = ?, 
      phone = ?, 
      location = ?, 
      image = ?
    WHERE user_id = ?
    `,
    [
      name,
      Number(category_id),
      Number(delivery_fee),
      phone,
      location,
      image,
      Number(userId)
    ]
  );
};

/* ============================
   TOGGLE IS_OPEN
============================ */
export const updateShopAvailabilityForOwner = async (userId, isOpen) => {
  await db.query(`UPDATE shops SET is_open = ? WHERE user_id = ?`, [
    isOpen,
    userId,
  ]);
};

export const updateShopStatusById = async (id, isOpen) => {
  await db.query(`UPDATE shops SET is_open = ? WHERE id = ?`, [isOpen, id]);
};

