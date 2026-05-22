import { Router } from "express";
import { createOrder, getAllOrders } from "../controllers/order.controller";
import { auth, authorizeRole } from "../../utils/auth";
import { deleteAllOrders } from "../controllers/order.controller";

const router = Router();

router.get("/all", auth, authorizeRole("admin"), getAllOrders);
router.post("/", createOrder);
router.delete(
  "/delete-all",
  auth,
  authorizeRole("super_admin"),
  deleteAllOrders,
);

export default router;
