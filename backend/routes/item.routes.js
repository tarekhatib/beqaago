import express from "express";
import {
  getItems,
  addItem,
  removeItem,
  updateItem
} from "../controllers/item.controller.js";

const router = express.Router();

// GET items for shop
router.get("/:shopId", getItems);

// CREATE item
router.post("/:shopId", addItem);

// UPDATE item
router.put("/:itemId", updateItem);


// DELETE item
router.delete("/:itemId", removeItem);

export default router;
