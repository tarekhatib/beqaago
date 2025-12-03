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

import {
  getItemsByShopId,
  createItemForShop
} from "../models/item.model.js";

/* ============================
   PUBLIC — list shops
============================ */
export const listShops = async (req, res) => {
  try {
    res.json(await getAllShops());
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB error" });
  }
};

/* SEARCH */
export const searchShopsHandler = async (req, res) => {
  try {
    const q = req.query.q || "";
    res.json(await searchShops(q));
  } catch (err) {
    res.status(500).json({ message: "DB error" });
  }
};

/* GET SHOP */
export const getShop = async (req, res) => {
  try {
    const s = await getShopById(req.params.id);
    if (!s) return res.status(404).json({ message: "Not found" });
    res.json(s);
  } catch (err) {
    res.status(500).json({ message: "DB error" });
  }
};

/* GET SHOP ITEMS */
export const getShopItems = async (req, res) => {
  try {
    const items = await getItemsByShopId(req.params.id);
    res.json(items);
  } catch (err) {
    console.error("❌ getShopItems:", err);
    res.status(500).json({ message: "DB error" });
  }
};

/* GET OWNER SHOP */
export const getShopByOwner = async (req, res) => {
  try {
    res.json((await getShopByOwnerId(req.params.userId)) || {});
  } catch (err) {
    res.status(500).json({ message: "DB error" });
  }
};

/* CREATE SHOP */
export const createShopForOwner = async (req, res) => {
  try {
    const { name, category_id, delivery_fee, phone, location, image } = req.body;

    if (!name || !category_id || delivery_fee === undefined)
      return res.status(400).json({ message: "Missing fields" });

    const id = await createShop(
      req.params.userId,
      name,
      category_id,
      delivery_fee,
      phone,
      location,
      image || "/images/vendor.jpg"
    );

    res.status(201).json({ id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB error" });
  }
};

/* UPDATE SHOP INFO */
export const updateShopInfo = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { name, category_id, delivery_fee, phone, location, image } = req.body;

    await updateShopForOwner(userId, {
      name,
      category_id,
      delivery_fee,
      phone,
      location,
      image
    });

    res.json({ message: "Shop updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "DB error" });
  }
};

/* AVAILABILITY */
export const updateAvailability = async (req, res) => {
  try {
    await updateShopAvailabilityForOwner(
      req.params.userId,
      req.body.is_open ? 1 : 0
    );
    res.json({ message: "Updated" });
  } catch (err) {
    res.status(500).json({ message: "DB error" });
  }
};

export const setShopStatus = async (req, res) => {
  try {
    await updateShopStatusById(req.params.id, req.body.is_open ? 1 : 0);
    res.json({ message: "Updated" });
  } catch (err) {
    res.status(500).json({ message: "DB error" });
  }
};

/* ADD ITEM (vendor) */
export const addItemToShop = async (req, res) => {
  try {
    const { name, description, price, image } = req.body;

    if (!name || !price)
      return res.status(400).json({ message: "Missing fields" });

    await createItemForShop(
      req.params.id,
      name,
      description || null,
      price,
      image || "/images/food.jpg"
    );

    res.json({ message: "Item added" });
  } catch (err) {
    console.error("❌ addItemToShop:", err);
    res.status(500).json({ message: "DB error" });
  }
};
