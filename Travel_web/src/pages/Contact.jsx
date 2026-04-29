import { useState } from "react";

function Contact() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.includes("@")) {
      setError("Please enter a valid email");
    } else {
      setError("");
      alert("Submitted successfully");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-white flex items-center justify-center px-4">

      {/* Card */}
      <div className="w-full max-w-lg bg-white/70 backdrop-blur-xl border border-indigo-100 shadow-xl rounded-3xl p-6 sm:p-8">

        {/* Heading */}
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-indigo-900">
            Contact Us
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            We’d love to hear from you
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <div>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-3 rounded-xl border border-indigo-100 bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
              required
            />
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border bg-white/80 focus:outline-none focus:ring-2 text-sm ${
                error
                  ? "border-red-300 focus:ring-red-200"
                  : "border-indigo-100 focus:ring-indigo-300"
              }`}
              required
            />
            {error && (
              <p className="text-xs text-red-500 mt-1">{error}</p>
            )}
          </div>

          {/* Message */}
          <div>
            <textarea
              rows="4"
              placeholder="Your Message"
              className="w-full px-4 py-3 rounded-xl border border-indigo-100 bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm resize-none"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition"
          >
            Send Message
          </button>
        </form>

      </div>
    </div>
  );
}

export default Contact;