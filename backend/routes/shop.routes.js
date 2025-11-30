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

/* -------- SEARCH (put first) -------- */
router.get("/search", searchShopsHandler);

/* -------- PUBLIC USER ROUTES -------- */
router.get("/", listShops);
router.get("/:id", getShop);
router.get("/:id/items", getShopItems);

/* -------- VENDOR ROUTES -------- */
router.get("/owner/:userId", getShopByOwner);
router.post("/owner/:userId", createShopForOwner);
router.put("/owner/:userId", updateShopInfo);
router.put("/owner/:userId/availability", updateAvailability);

// Toggle open/close by shop id (for dashboard switch)
router.patch("/status/:id", setShopStatus);

// Vendor adds item
router.post("/:id/items", addItemToShop);

export default router;
