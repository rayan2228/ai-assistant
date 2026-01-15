import express from "express";
import {
  googleCallBackController,
  googleLoginController,
} from "../controllers/auth.controller";
const router = express.Router();

router.get("/auth/google/login", googleLoginController);
router.get("/auth/google/callback", googleCallBackController);

export default router;
