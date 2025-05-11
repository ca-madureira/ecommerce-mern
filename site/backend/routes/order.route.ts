import { Router } from "express";
import { createOrder, getOrders } from "../controllers/order.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();
router.use(requireAuth)

router.post("/create", createOrder);
router.get("/all", getOrders);
export default router;
