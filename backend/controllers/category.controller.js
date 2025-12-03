import { getAllCategories } from "../models/category.model.js";

export const listCategories = async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.json(categories);
  } catch (err) {
    console.error("❌ listCategories:", err);
    res.status(500).json({ message: "Database error" });
  }
};
