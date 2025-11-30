import db from "../config/db.js";
import {
  getAllShops,
  searchShops,
  getShopById,
  getShopByOwnerId,
  createShop,
  updateShopForOwner,
  updateShopAvailabilityForOwner,
  updateShopStatusById
} from "../models/shop.model.js";

import { getItemsByShopId, createItemForShop } from "../models/item.model.js";

// USER – list shops
export const listShops = async (req, res) => {
  try {
    const shops = await getAllShops();
    res.json(shops);
  } catch (err) {
    console.error("❌ listShops:", err);
    res.status(500).json({ message: "Database error" });
  }
};

// USER – search shops
export const searchShopsHandler = async (req, res) => {
  try {
    const q = req.query.q || "";
    const rows = await searchShops(q);
    res.json(rows);
  } catch (err) {
    console.error("❌ searchShops:", err);
    res.status(500).json({ message: "Database error" });
  }
};

// USER – get shop by id
export const getShop = async (req, res) => {
  try {
    const shop = await getShopById(req.params.id);
    if (!shop) return res.status(404).json({ message: "Not found" });
    res.json(shop);
  } catch (err) {
    console.error("❌ getShop:", err);
    res.status(500).json({ message: "Database error" });
  }
};

// USER – get shop items
export const getShopItems = async (req, res) => {
  try {
    const items = await getItemsByShopId(req.params.id);
    res.json(items);
  } catch (err) {
    console.error("❌ getShopItems:", err);
    res.status(500).json({ message: "Database error" });
  }
};

// VENDOR – get shop by owner
export const getShopByOwner = async (req, res) => {
  try {
    const shop = await getShopByOwnerId(req.params.userId);
    if (!shop) return res.json({});
    res.json(shop);
  } catch (err) {
    console.error("❌ getShopByOwner:", err);
    res.status(500).json({ message: "Database error" });
  }
};

// VENDOR – create shop
export const createShopForOwner = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { name, type, phone, location, image } = req.body;

    if (!name)
      return res.status(400).json({ message: "Shop name is required" });

    const newId = await createShop(
      userId,
      name,
      type || "restaurant",
      phone,
      location,
      image || "/images/vendor.jpg"
    );

    res.status(201).json({ id: newId });
  } catch (err) {
    console.error("❌ createShopForOwner:", err);
    res.status(500).json({ message: "Database error" });
  }
};

// VENDOR – update shop info
export const updateShopInfo = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { name, type, phone, location, image } = req.body;

    await updateShopForOwner(userId, { name, type, phone, location, image });
    res.json({ message: "Shop updated" });
  } catch (err) {
    console.error("❌ updateShopInfo:", err);
    res.status(500).json({ message: "Database error" });
  }
};

// VENDOR – availability (by owner)
export const updateAvailability = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { is_open } = req.body;
    await updateShopAvailabilityForOwner(userId, is_open ? 1 : 0);
    res.json({ message: "Availability updated" });
  } catch (err) {
    console.error("❌ updateAvailability:", err);
    res.status(500).json({ message: "Database error" });
  }
};

// VENDOR – availability (by shop id) for dashboard switch
export const setShopStatus = async (req, res) => {
  try {
    await updateShopStatusById(req.params.id, req.body.is_open ? 1 : 0);
    res.json({ message: "Status updated" });
  } catch (err) {
    console.error("❌ setShopStatus:", err);
    res.status(500).json({ message: "Database error" });
  }
};

// VENDOR – add item to shop
export const addItemToShop = async (req, res) => {
  try {
    const shopId = req.params.id;
    const { name, description, price, image } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Missing fields" });
    }

    await createItemForShop(
      shopId,
      name,
      description || "",
      price,
      image || "/images/food.jpg"
    );

    res.status(201).json({ message: "Item added" });
  } catch (err) {
    console.error("❌ addItemToShop:", err);
    res.status(500).json({ message: "Database error" });
  }
};
