import { Router } from "express";
import { login, refresh, signup } from "../controllers/auth.controller";
import { auth } from "../../utils/auth";

const router = Router();

router.post("/signup", signup);

router.post("/login", login);

router.get("/refresh", refresh);

router.get("/me", () => {});

router.put("/update/:id", () => {});

router.delete("/delete/:id", () => {});

router.get("/test", auth, (req, res) => {
  res.send("this is super sensative data");
});

export default router;
