import express from "express";
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  checkIn,
  checkOut,
  cancelBooking,
  getBookingStatistics,
  deleteBooking,
  getGuestBookings,
  submitFeedback,
  sendInvoiceEmail
} from "../controllers/BookingController.js";
import authMiddleware from "../middleware/Auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Booking operations
router.post("/", createBooking);
router.get("/", getAllBookings);
router.delete("/:id", deleteBooking);
router.get("/statistics", getBookingStatistics);
router.get("/guest/:guestId", getGuestBookings);
router.get("/:id", getBookingById);
router.put("/:id", updateBooking);
router.patch("/:id/checkin", checkIn);
router.patch("/:id/checkout", checkOut);
router.patch("/:id/cancel", cancelBooking);
router.post("/:id/feedback", submitFeedback);
router.post("/:id/send-invoice", sendInvoiceEmail);

export default router;
