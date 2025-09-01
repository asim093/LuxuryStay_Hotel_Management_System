import express from "express";
import { 
  forgotPassword, 
  Login, 
  resetPassword, 
  Signup, 
  verifyOtp,
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
  getProfile
} from "../controllers/Usercontroller.js";
import upload from "../middleware/Multer.middleware.js";
import authMiddleware, { 
  requireAdmin, 
  requireManager, 
  requireReceptionist, 
  requireHousekeeping, 
  requireGuest 
} from "../middleware/Auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/Signup", upload.single("profileImage"), Signup);
router.post("/Login", Login);
router.post("/forgotpassword", forgotPassword);
router.post("/verifyotp", verifyOtp);
router.post("/resetpassword", resetPassword);

// Protected routes - require authentication
router.get("/profile", authMiddleware, getProfile);

// Admin only routes
router.get("/users", authMiddleware, requireAdmin, getAllUsers);
router.patch("/users/:userId/role", authMiddleware, requireAdmin, updateUserRole);
router.patch("/users/:userId/status", authMiddleware, requireAdmin, toggleUserStatus);

// Role-specific routes (examples)
router.get("/admin/dashboard", authMiddleware, requireAdmin, (req, res) => {
  res.json({ message: "Admin Dashboard", role: req.userRole });
});

router.get("/manager/dashboard", authMiddleware, requireManager, (req, res) => {
  res.json({ message: "Manager Dashboard", role: req.userRole });
});

router.get("/receptionist/dashboard", authMiddleware, requireReceptionist, (req, res) => {
  res.json({ message: "Receptionist Dashboard", role: req.userRole });
});

router.get("/housekeeping/dashboard", authMiddleware, requireHousekeeping, (req, res) => {
  res.json({ message: "Housekeeping Dashboard", role: req.userRole });
});

router.get("/guest/dashboard", authMiddleware, requireGuest, (req, res) => {
  res.json({ message: "Guest Dashboard", role: req.userRole });
});

export default router;
