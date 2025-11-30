// backend/controllers/item.controller.js
import {
  getMenuByShopId,
  createMenuItem,
  deleteMenuItemById,
  updateMenuItem
} from "../models/shop_menu.model.js";

import { getShopByOwnerId, getShopById } from "../models/shop.model.js";

/* -----------------------------------------------------
   GET MENU ITEMS FOR SHOP (public)
   Endpoint: GET /api/shops/:shopId/menu
----------------------------------------------------- */
export const getShopMenu = async (req, res) => {
  try {
    const shopId = req.params.shopId;
    const items = await getMenuByShopId(shopId);

    res.json(items);
  } catch (err) {
    console.error("❌ Menu fetch error:", err);
    res.status(500).json({ message: "Database error" });
  }
};

/* -----------------------------------------------------
   GET MENU FOR VENDOR DASHBOARD
   (Vendor sees his own shop items)
   Endpoint: GET /api/shops/owner/:userId/menu
----------------------------------------------------- */
export const getVendorMenu = async (req, res) => {
  try {
    const userId = req.params.userId;

    const shop = await getShopByOwnerId(userId);
    if (!shop) return res.json([]);

    const items = await getMenuByShopId(shop.id);
    res.json(items);
  } catch (err) {
    console.error("❌ Vendor menu error:", err);
    res.status(500).json({ message: "Database error" });
  }
};

/* -----------------------------------------------------
   ADD NEW ITEM (Vendor adds menu item)
   Endpoint: POST /api/shops/:shopId/menu
----------------------------------------------------- */
export const addItem = async (req, res) => {
  try {
    const shopId = req.params.shopId;
    const { item_name, price, image } = req.body;

    if (!item_name || !price)
      return res.status(400).json({ message: "Missing fields" });

    await createMenuItem(shopId, item_name, price, image || "/images/food.jpg");

    res.json({ message: "Item added successfully" });
  } catch (err) {
    console.error("❌ Add item error:", err);
    res.status(500).json({ message: "Database error" });
  }
};

/* -----------------------------------------------------
   UPDATE ITEM
   Endpoint: PUT /api/menu/:itemId
----------------------------------------------------- */
export const editItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const { item_name, price, image } = req.body;

    await updateMenuItem(itemId, item_name, price, image);
    res.json({ message: "Item updated successfully" });
  } catch (err) {
    console.error("❌ Update item error:", err);
    res.status(500).json({ message: "Database error" });
  }
};

/* -----------------------------------------------------
   DELETE ITEM
   Endpoint: DELETE /api/menu/:itemId
----------------------------------------------------- */
export const removeItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    await deleteMenuItemById(itemId);

    res.json({ message: "Item deleted" });
  } catch (err) {
    console.error("❌ Delete item error:", err);
    res.status(500).json({ message: "Database error" });
  }
};
