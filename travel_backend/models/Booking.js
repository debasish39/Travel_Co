import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    // 🔑 Booking ID
    bookingId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // 📦 Package / Destination
    title: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // 👤 User Info
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email"],
    },

    // 📱 Phone Number (NEW)
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [
        /^[6-9]\d{9}$/,
        "Please enter a valid 10-digit Indian phone number",
      ],
    },

    // 👥 Guests
    adults: {
      type: Number,
      required: true,
      min: 1,
    },

    children: {
      type: Number,
      default: 0,
      min: 0,
    },

    // 📅 Dates
    checkIn: {
      type: Date,
      required: true,
    },

    checkOut: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > this.checkIn;
        },
        message: "Check-out must be after check-in",
      },
    },

    // 💰 Pricing
    days: {
      type: Number,
      required: true,
      min: 1,
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 1,
    },

    // 💳 Payment
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "cod", "failed"],
      required: true,
    },

    paymentMode: {
      type: String,
      enum: ["online", "cod"],
      required: true,
    },

    razorpay_order_id: {
      type: String,
      default: null,
    },

    razorpay_payment_id: {
      type: String,
      default: null,
    },

    // ❌ Cancellation
    cancelled: {
      type: Boolean,
      default: false,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Booking", bookingSchema);