import { Router } from "express";
import { createOrder, getAllOrders } from "../controllers/order.controller";
import { auth, authorizeRole } from "../../utils/auth";

const router = Router();

router.get("/all", auth, authorizeRole("admin"), getAllOrders);
router.post("/", createOrder);

export default router;
