const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authenticateToken = require("../utils/authenticateToken");

router.post("/signup", authController.Signup);
router.post("/login", authController.Login);
router.post("/logout", authController.Logout);
router.get("/:id/verify/:token", authenticateToken, authController.VerifyEmail);
router.get("/get-user", authenticateToken, authController.getUser);
router.post("/forgot-password", authController.forgotPassword);
router.post("/:id/reset-password/:token", authController.resetPassword);

module.exports = router;
