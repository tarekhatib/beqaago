import db from "../config/db.js";

export const getAllCategories = async () => {
  const [rows] = await db.query("SELECT id, name FROM categories ORDER BY name");
  return rows;
};
