import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Usermodle } from "../Models/User.model.js";
dotenv.config();

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token provided, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || "defaultsecret");

    req.user = decoded.user;

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Token is not valid", status: "failed" });
  }
};

// Role-based authorization middleware
export const authorizeRoles = (...roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const user = await Usermodle.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!user.isActive) {
        return res.status(403).json({ message: "Account is deactivated" });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({ 
          message: `Access denied. Required roles: ${roles.join(', ')}` 
        });
      }

      req.userRole = user.role;
      next();
    } catch (error) {
      console.error("Authorization error:", error);
      res.status(500).json({ message: "Authorization error", status: "failed" });
    }
  };
};

// Specific role middlewares
export const requireAdmin = authorizeRoles('Admin');
export const requireManager = authorizeRoles('Admin', 'Manager');
export const requireReceptionist = authorizeRoles('Admin', 'Manager', 'Receptionist');
export const requireHousekeeping = authorizeRoles('Admin', 'Manager', 'Housekeeping');
export const requireGuest = authorizeRoles('Admin', 'Manager', 'Receptionist', 'Housekeeping', 'Guest');

export default authMiddleware;
