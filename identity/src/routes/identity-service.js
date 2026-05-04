import express from "express";
import {
  resgiterUser,
  loginUser,
  refreshTokenUser,
  logoutUser,
} from "../controllers/identity-controller.js";

const router = express.Router();

router.post("/register", resgiterUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshTokenUser);
router.post("/logout", logoutUser);

export default router;
