import Booking from "../models/Booking.js";
import { sendEmail } from "../utils/sendEmail.js";
export const createBooking = async (req, res) => {
  try {
    const { bookingId, email, totalPrice, days, paymentMode, paymentStatus } =
      req.body;

    // ✅ BASIC VALIDATION
    if (!bookingId || !email || !totalPrice || !days) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // ✅ DUPLICATE CHECK
    const exists = await Booking.findOne({ bookingId });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Booking already exists",
      });
    }

    // ✅ PAYMENT CONSISTENCY CHECK
    if (paymentMode === "cod" && paymentStatus !== "cod") {
      return res.status(400).json({
        success: false,
        message: "COD must have paymentStatus = 'cod'",
      });
    }

    if (paymentMode === "online" && paymentStatus !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Online payment must be 'paid'",
      });
    }

    // ✅ CREATE BOOKING
    const booking = await Booking.create(req.body);

    // ===============================
    // 📧 SEND EMAIL (NON-BLOCKING)
    // ===============================
// ===============================
// 📧 SEND EMAIL (FIXED)
// ===============================
try {
  console.log("📩 Sending email to:", booking.email);

  await sendEmail(
    booking.email,
    "🎉 Booking Confirmed – TravelCo",
     `<div style="margin:0;padding:0;background:#eef2f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;"> 
    
    <div style="max-width:600px;margin:30px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.1);">
      
      <!-- HEADER -->
      <div style="background:linear-gradient(135deg,#667eea,#764ba2);padding:30px 20px;text-align:center;color:white;">
        <h1 style="margin:0;font-size:26px;">✈️ TravelCo</h1>
        <p style="margin-top:8px;font-size:14px;opacity:0.9;">Your journey starts here</p>
      </div>

      <!-- STATUS -->
      <div style="padding:20px;text-align:center;">
        <div style="display:inline-block;background:#e6fffa;color:#00a884;padding:8px 14px;border-radius:50px;font-size:13px;font-weight:600;">
          ${booking.paymentStatus === "paid" ? "💳 Paid" : "💵 Cash on Arrival"}
        </div>
      </div>

      <!-- BODY -->
      <div style="padding:0 25px 25px;">
        <h2 style="color:#222;">Hi ${booking.name},</h2>

        <p style="color:#555;font-size:14px;line-height:1.6;">
          Your booking has been successfully confirmed. Below are your complete booking details:
        </p>

        <!-- DETAILS CARD -->
        <div style="background:#f8fafc;border-radius:12px;padding:18px;margin-top:20px;border:1px solid #eee;">
          
          <table style="width:100%;font-size:14px;color:#333;">
            <tr><td><b>🆔 Booking ID</b></td><td style="text-align:right;">${booking.bookingId}</td></tr>
            <tr><td><b>📦 Package</b></td><td style="text-align:right;">${booking.title}</td></tr>
            <tr><td><b>👨‍👩‍👧 Guests</b></td><td style="text-align:right;">${booking.adults + booking.children}</td></tr>
            <tr><td><b>📅 Check-In</b></td><td style="text-align:right;">${new Date(booking.checkIn).toDateString()}</td></tr>
            <tr><td><b>📅 Check-Out</b></td><td style="text-align:right;">${new Date(booking.checkOut).toDateString()}</td></tr>
            <tr><td><b>⏳ Duration</b></td><td style="text-align:right;">${booking.days} Days</td></tr>
            <tr><td><b>💰 Total</b></td><td style="text-align:right;color:#16a34a;font-weight:bold;">₹${booking.totalPrice}</td></tr>
          </table>

        </div>

        <!-- CONTACT -->
        <div style="margin-top:20px;">
          <h3 style="font-size:16px;color:#333;">📞 Contact Information</h3>
          <p style="font-size:14px;color:#555;">
            Email: ${booking.email}<br/>
            Phone: ${booking.phone}
          </p>
        </div>

        <!-- PAYMENT -->
        <div style="margin-top:20px;">
          <h3 style="font-size:16px;color:#333;">💳 Payment Details</h3>
          <p style="font-size:14px;color:#555;">
            Mode: ${booking.paymentMode.toUpperCase()}<br/>
            Status: ${booking.paymentStatus.toUpperCase()}
          </p>
        </div>

        <!-- CTA -->
        <div style="text-align:center;margin:30px 0;">
          <a href="https://travelco.debasish.xyz/track-booking"
             style="background:linear-gradient(135deg,#667eea,#764ba2);
                    color:white;
                    padding:14px 26px;
                    font-size:14px;
                    font-weight:600;
                    text-decoration:none;
                    border-radius:8px;
                    display:inline-block;
                    box-shadow:0 6px 20px rgba(102,126,234,0.4);">
            🔍 Track Your Booking by BookingId
          </a>
        </div>

        <!-- EXTRA INFO -->
        <p style="font-size:13px;color:#777;">
          Booking created on: ${new Date(booking.createdAt).toLocaleString()}
        </p>

        <p style="margin-top:20px;font-size:14px;color:#333;">
          🌍 Have an amazing trip!<br/>
          <b>— TravelCo Team</b>
        </p>
      </div>

      <!-- FOOTER -->
      <div style="background:#f1f5f9;padding:15px;text-align:center;font-size:12px;color:#888;">
        © ${new Date().getFullYear()} TravelCo. All rights reserved.<br/>
        Made with ❤️ for travelers
      </div>

    </div>
  </div>
  `
  );

  console.log("✅ Email function completed");

} catch (err) {
  console.log("❌ Email failed:", err.message);
}
   // ✅ RESPONSE
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Create Booking Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create booking",
      error: error.message,
    });
  }
};

// Get all bookings
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve bookings",
      error: error.message,
    });
  }
};

//Get booking by ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findOne({ bookingId: req.params.id });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Booking retrieved successfully",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve booking",
      error: error.message,
    });
  }
};
