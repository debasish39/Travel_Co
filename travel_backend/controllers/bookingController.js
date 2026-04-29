import Booking from '../models/Booking.js';
import { sendEmail } from "../utils/sendEmail.js";
export const createBooking = async (req, res) => {
  try {
    const {
      bookingId,
      email,
      totalPrice,
      days,
      paymentMode,
      paymentStatus,
    } = req.body;

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
    sendEmail(
      booking.email,
      "Booking Confirmed 🎉",
      `
        <h2>Booking Confirmed</h2>
        <p><b>Booking ID:</b> ${booking.bookingId}</p>
        <p><b>Package:</b> ${booking.title}</p>
        <p><b>Guests:</b> ${booking.adults + booking.children}</p>
        <p><b>Total:</b> ₹${booking.totalPrice}</p>
      `
    ).catch((err) =>
      console.log("Email failed:", err.message)
    );

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
export const getBookings=async(req,res)=>{
    try{    
        const bookings=await Booking.find().sort({createdAt:-1});
        res.status(200).json({
            success:true,
            message:'Bookings retrieved successfully',
            data:bookings
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:'Failed to retrieve bookings',  
            error:error.message
        });
    }
};


//Get booking by ID
export const getBookingById=async(req,res)=>{
    try{
        const booking=await Booking.findOne({bookingId:req.params.id});
        if(!booking){
            return res.status(404).json({
                success:false,
                message:'Booking not found'
            });
        }
        res.status(200).json({
            success:true,
            message:'Booking retrieved successfully',
            data:booking
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:'Failed to retrieve booking',  
            error:error.message
        });
    }
}