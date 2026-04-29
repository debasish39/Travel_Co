import { useState } from "react";

export default function TrackBooking() {
  const [bookingId, setBookingId] = useState("");
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!bookingId.trim()) {
      return setError("Enter booking ID");
    }

    try {
      setLoading(true);
      setError("");
      setBooking(null);

      const res = await fetch(
        `http://localhost:5000/api/bookings/${bookingId}`
      );

      const data = await res.json();

      if (data.success) {
        setBooking(data.data);
      } else {
        setError("Booking not found");
      }
    } catch (err) {
      console.error(err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN").format(price);

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">

      {/* 🔍 Search Box */}
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">
          Track Booking
        </h2>

        <input
          type="text"
          placeholder="Enter Booking ID (e.g. BK-20260428-7789)"
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value)}
          className="w-full border p-3 rounded mb-3"
        />

        <button
          onClick={handleSearch}
          className="w-full bg-indigo-600 text-white py-2 rounded"
        >
          Search
        </button>

        {error && (
          <p className="text-red-500 text-sm mt-2 text-center">
            {error}
          </p>
        )}
      </div>

      {/* ⏳ Loading */}
      {loading && (
        <p className="mt-6 text-gray-500">Fetching booking...</p>
      )}

      {/* ✅ Result */}
      {booking && (
        <div className="mt-6 bg-white rounded-xl shadow p-6 w-full max-w-md">

          <h3 className="text-lg font-bold text-green-600 mb-3">
            Booking Found
          </h3>

          <div className="space-y-2 text-sm">

            <p><b>ID:</b> {booking.bookingId}</p>

            <p><b>Package:</b> {booking.title}</p>

            <p><b>Name:</b> {booking.name}</p>
            <p><b>Email:</b> {booking.email}</p>

            <p>
              <b>People:</b>{" "}
              {booking.adults + booking.children}
            </p>

            <p>
              <b>Dates:</b>{" "}
              {formatDate(booking.checkIn)} →{" "}
              {formatDate(booking.checkOut)}
            </p>

            {/* 🔥 Payment Status */}
            <p>
              <b>Status:</b>{" "}
              <span
                className={`px-2 py-1 rounded text-white text-xs ${
                  booking.paymentStatus === "paid"
                    ? "bg-green-500"
                    : booking.paymentStatus === "cod"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              >
                {booking.paymentStatus}
              </span>
            </p>

            <p className="text-lg font-bold text-indigo-600">
              ₹{formatPrice(booking.totalPrice)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}