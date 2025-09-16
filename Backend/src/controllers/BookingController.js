import { BookingModel } from "../Models/Booking.model.js";
import { RoomModel } from "../Models/Room.model.js";
import { Usermodle } from "../Models/User.model.js";

// Generate unique booking number
const generateBookingNumber = () => {
  const prefix = 'BK';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
};

export const createBooking = async (req, res) => {
  try {
    const bookingData = req.body;

    const { guest, room, checkInDate, checkOutDate, numberOfGuests } = bookingData;

    if (!guest || !room || !checkInDate || !checkOutDate || !numberOfGuests) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const roomExists = await RoomModel.findById(room);
    if (!roomExists) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (roomExists.status !== 'Available') {
      return res.status(400).json({ message: "Room is not available" });
    }

    if (roomExists.capacity < numberOfGuests) {
      return res.status(400).json({ message: `Maximum Room Capacity for the number of guests is ${roomExists.capacity}` });
    }

    const existingBooking = await BookingModel.findOne({
      room,
      status: { $in: ['Confirmed', 'Checked In'] },
      $or: [
        {
          checkInDate: { $lte: new Date(checkOutDate) },
          checkOutDate: { $gte: new Date(checkInDate) }
        }
      ]
    });

    if (existingBooking) {
      return res.status(400).json({ message: "Room is already booked for the selected dates" });
    }

    const nights = Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24));
    const totalAmount = roomExists.pricePerNight * nights;

    const booking = await BookingModel.create({
      ...bookingData,
      bookingNumber: generateBookingNumber(),
      totalAmount,
      createdBy: req.user?.id
    });

    // Update room status
    await RoomModel.findByIdAndUpdate(room, { status: 'Occupied' });

    // Populate the booking with guest and room details
    const populatedBooking = await BookingModel.findById(booking._id)
      .populate('guest', 'name email')
      .populate('room', 'roomNumber roomType pricePerNight');

    // Send notifications for new booking
    try {
      const NotificationService = (await import('../services/notificationService.js')).default;
      await NotificationService.createNotification({
        title: 'New Booking Created',
        message: `New booking created for Room ${populatedBooking.room?.roomNumber} by ${populatedBooking.guest?.name}`,
        type: 'info',
        category: 'booking',
        recipientRole: 'Receptionist',
        relatedEntity: {
          type: 'booking',
          id: populatedBooking._id
        },
        metadata: {
          roomNumber: populatedBooking.room?.roomNumber,
          guestName: populatedBooking.guest?.name,
          totalAmount: populatedBooking.totalAmount,
          bookingNumber: populatedBooking.bookingNumber
        }
      });

      // Notify Manager about new booking
      await NotificationService.createNotification({
        title: 'New Revenue',
        message: `New booking worth ₹${populatedBooking.totalAmount} - Room ${populatedBooking.room?.roomNumber}`,
        type: 'success',
        category: 'booking',
        recipientRole: 'Manager',
        relatedEntity: {
          type: 'booking',
          id: populatedBooking._id
        },
        metadata: {
          roomNumber: populatedBooking.room?.roomNumber,
          guestName: populatedBooking.guest?.name,
          revenue: populatedBooking.totalAmount,
          bookingNumber: populatedBooking.bookingNumber
        }
      });

      console.log(`Booking creation notifications sent for booking ${populatedBooking._id}`);
    } catch (notificationError) {
      console.error('Error sending booking creation notifications:', notificationError);
    }

    res.status(201).json({
      message: "Booking created successfully",
      booking: populatedBooking
    });
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all bookings with filtering and pagination
export const getAllBookings = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      paymentStatus,
      checkInDate,
      checkOutDate,
      guest,
      room,
      search
    } = req.query;

    const filter = {};

    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (guest) filter.guest = guest;
    if (room) filter.room = room;

    if (checkInDate) {
      filter.checkInDate = { $gte: new Date(checkInDate) };
    }
    if (checkOutDate) {
      filter.checkOutDate = { $lte: new Date(checkOutDate) };
    }

    const bookings = await BookingModel.find(filter)
      .populate('guest', 'name email')
      .populate('room', 'roomNumber roomType')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await BookingModel.countDocuments(filter);

    res.json({
      bookings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error("Get all bookings error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get booking by ID
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await BookingModel.findById(id)
      .populate('guest', 'name email phone')
      .populate('room', 'roomNumber roomType pricePerNight amenities')
      .populate('createdBy', 'name');

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ booking });
  } catch (error) {
    console.error("Get booking by ID error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update booking
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const booking = await BookingModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('guest', 'name email')
      .populate('room', 'roomNumber roomType');

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking updated successfully", booking });
  } catch (error) {
    console.error("Update booking error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkIn = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const booking = await BookingModel.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status !== 'Confirmed') {
      return res.status(400).json({ message: "Only confirmed bookings can be checked in" });
    }

    booking.status = 'Checked In';
    booking.actualCheckInTime = new Date();
    if (notes) booking.checkInNotes = notes;

    // Update room status to Occupied
    const { RoomModel } = await import('../Models/Room.model.js');
    await RoomModel.findByIdAndUpdate(booking.room, { status: 'Occupied' });

    await booking.save();

    // Send notifications
    try {
      const NotificationService = (await import('../services/notificationService.js')).default;
      await NotificationService.notifyBookingCheckin(booking);
    } catch (notificationError) {
      console.error('Error sending checkin notifications:', notificationError);
    }

    res.json({ message: "Guest checked in successfully", booking });
  } catch (error) {
    console.error("Check-in error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkOut = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const booking = await BookingModel.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status !== 'Checked In') {
      return res.status(400).json({ message: "Only checked-in guests can be checked out" });
    }

    booking.status = 'Checked Out';
    booking.actualCheckOutTime = new Date();
    if (notes) booking.checkOutNotes = notes;

    // Update room status to Dirty (needs cleaning)
    const { RoomModel } = await import('../Models/Room.model.js');
    await RoomModel.findByIdAndUpdate(booking.room, { status: 'Dirty' });

    await booking.save();

    // Send notifications
    try {
      const NotificationService = (await import('../services/notificationService.js')).default;
      await NotificationService.notifyBookingCheckout(booking);
    } catch (notificationError) {
      console.error('Error sending checkout notifications:', notificationError);
    }

    // Send invoice email
    try {
      const populatedBooking = await BookingModel.findById(id)
        .populate('guest', 'name email')
        .populate('room', 'roomNumber roomType pricePerNight');
      
      const nights = Math.ceil((new Date(populatedBooking.checkOutDate) - new Date(populatedBooking.checkInDate)) / (1000 * 60 * 60 * 24));
      
      // Import email service
      const sendMail = (await import('../utils/email-send.js')).default;
      
      await sendMail({
        email: [populatedBooking.guest.email],
        templateName: 'checkout_invoice',
        templateVariables: {
          guestName: populatedBooking.guest.name,
          roomNumber: populatedBooking.room.roomNumber,
          roomType: populatedBooking.room.roomType,
          checkInDate: new Date(populatedBooking.checkInDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          checkOutDate: new Date(populatedBooking.checkOutDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          nights: nights,
          roomRate: populatedBooking.room.pricePerNight,
          totalAmount: populatedBooking.totalAmount,
          bookingId: populatedBooking._id.slice(-8),
          checkoutTime: new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        }
      });

      console.log('Invoice email sent successfully to:', populatedBooking.guest.email);
    } catch (emailError) {
      console.error('Error sending invoice email:', emailError);
      // Don't fail the checkout if email fails
    }

    res.json({ message: "Guest checked out successfully", booking });
  } catch (error) {
    console.error("Check-out error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get guest bookings
export const getGuestBookings = async (req, res) => {
  try {
    const { guestId } = req.params;

    const bookings = await BookingModel.find({ guest: guestId })
      .populate('room', 'roomNumber roomType pricePerNight')
      .sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (error) {
    console.error("Get guest bookings error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await BookingModel.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (['Checked In', 'Checked Out', 'Cancelled'].includes(booking.status)) {
      return res.status(400).json({ message: "Cannot cancel booking with current status" });
    }

    booking.status = 'Cancelled';
    booking.cancellationReason = reason;
    booking.cancelledAt = new Date();

    // Update room status to Available
    const { RoomModel } = await import('../Models/Room.model.js');
    await RoomModel.findByIdAndUpdate(booking.room, { status: 'Available' });

    await booking.save();

    // Send notifications
    try {
      const NotificationService = (await import('../services/notificationService.js')).default;
      await NotificationService.notifyBookingCancellation(booking);
    } catch (notificationError) {
      console.error('Error sending cancellation notifications:', notificationError);
    }

    res.json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await BookingModel.findByIdAndDelete(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Delete booking error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Duplicate checkOut function removed - using the one above

// Cancel booking
// Duplicate cancelBooking function removed - using the one above

// Submit feedback for a booking
export const submitFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const booking = await BookingModel.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status !== 'Checked Out') {
      return res.status(400).json({ message: "Feedback can only be submitted for checked out bookings" });
    }

    booking.feedback = {
      rating: rating,
      comment: comment,
      submittedAt: new Date()
    };

    await booking.save();

    res.json({ message: "Feedback submitted successfully", booking });
  } catch (error) {
    console.error("Submit feedback error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Send invoice email on checkout
export const sendInvoiceEmail = async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = await BookingModel.findById(id)
      .populate('guest', 'name email')
      .populate('room', 'roomNumber roomType pricePerNight');

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Here you would integrate with an email service like SendGrid, Nodemailer, etc.
    // For now, we'll just log the invoice details
    const invoiceData = {
      guestName: booking.guest.name,
      guestEmail: booking.guest.email,
      roomNumber: booking.room.roomNumber,
      roomType: booking.room.roomType,
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      nights: Math.ceil((new Date(booking.checkOutDate) - new Date(booking.checkInDate)) / (1000 * 60 * 60 * 24)),
      roomRate: booking.room.pricePerNight,
      totalAmount: booking.totalAmount,
      bookingId: booking._id
    };

    console.log('Invoice Email Data:', invoiceData);
    
    // TODO: Implement actual email sending
    // await sendInvoiceEmail(invoiceData);

    res.json({ message: "Invoice email sent successfully", invoiceData });
  } catch (error) {
    console.error("Send invoice email error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get booking statistics
export const getBookingStatistics = async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    const stats = await BookingModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          confirmedBookings: {
            $sum: { $cond: [{ $eq: ["$status", "Confirmed"] }, 1, 0] }
          },
          checkedInBookings: {
            $sum: { $cond: [{ $eq: ["$status", "Checked In"] }, 1, 0] }
          },
          checkedOutBookings: {
            $sum: { $cond: [{ $eq: ["$status", "Checked Out"] }, 1, 0] }
          },
          cancelledBookings: {
            $sum: { $cond: [{ $eq: ["$status", "Cancelled"] }, 1, 0] }
          },
          totalRevenue: { $sum: "$totalAmount" },
          averageBookingValue: { $avg: "$totalAmount" }
        }
      }
    ]);

    const dailyBookings = await BookingModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" }
          },
          count: { $sum: 1 },
          revenue: { $sum: "$totalAmount" }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 }
      }
    ]);

    res.json({
      overall: stats[0] || {
        totalBookings: 0,
        confirmedBookings: 0,
        checkedInBookings: 0,
        checkedOutBookings: 0,
        cancelledBookings: 0,
        totalRevenue: 0,
        averageBookingValue: 0
      },
      dailyBookings
    });
  } catch (error) {
    console.error("Get booking statistics error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
