import express from "express";
import {
  listShops,
  searchShopsHandler,
  getShop,
  getShopItems,
  getShopByOwner,
  createShopForOwner,
  updateShopInfo,
  updateAvailability,
  setShopStatus,
  addItemToShop
} from "../controllers/shop.controller.js";

const router = express.Router();

/* SEARCH */
router.get("/search", searchShopsHandler);

/* VENDOR ROUTES */
router.get("/owner/:userId", getShopByOwner);
router.post("/owner/:userId", createShopForOwner);
router.put("/owner/:userId", updateShopInfo);
router.put("/owner/:userId/availability", updateAvailability);

/* OPEN/CLOSE */
router.patch("/status/:id", setShopStatus);

/* PUBLIC ROUTES (⭐ ORDER MATTERS!) */
router.get("/:id/items", getShopItems);  // MUST be BEFORE getShop
router.get("/:id", getShop);             // LAST dynamic route
router.get("/", listShops);

/* ADD ITEM */
router.post("/:id/items", addItemToShop);

export default router;
