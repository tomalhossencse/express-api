import { Router } from "express";
import {
  getCurrentUser,
  login,
  logout,
  refresh,
  signup,
  updateUser,
} from "../controllers/auth.controller";
import { auth, authorizeRole } from "../../utils/auth";

const router = Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);
router.get("/refresh", refresh);

router.get("/me", getCurrentUser);

router.put("/update/:id", auth, updateUser);

// router.delete("/delete/:id", () => {});

router.get("/test", auth, authorizeRole("super_admin", "admin"), (req, res) => {
  res.send("this is super sensative data");
});

export default router;
