import {
  getItemsByShopId,
  createItemForShop,
  deleteItem,
  updateItemById
} from "../models/item.model.js";

/* ============================
   GET ITEMS FOR A SHOP
============================ */
export const getItems = async (req, res) => {
  try {
    const shopId = req.params.shopId;
    const items = await getItemsByShopId(shopId);
    res.json(items);
  } catch (err) {
    console.error("Get items error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   CREATE ITEM
============================ */
export const addItem = async (req, res) => {
  try {
    const shopId = req.params.shopId;
    const { name, description, price, image } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Name and price required" });
    }

    await createItemForShop(shopId, name, description, price, image);
    res.json({ message: "Item added successfully!" });
  } catch (err) {
    console.error("Add item error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   DELETE ITEM
============================ */
export const removeItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    await deleteItem(itemId);
    res.json({ message: "Item deleted!" });
  } catch (err) {
    console.error("Delete item error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   UPDATE ITEM
============================ */
export const updateItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const { name, description, price, image } = req.body;

    await updateItemById(itemId, { name, description, price, image });

    res.json({ message: "Item updated!" });
  } catch (err) {
    console.error("Update item error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
