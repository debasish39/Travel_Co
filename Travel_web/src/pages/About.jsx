import React from "react";

function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-white">

      {/* ── HERO ── */}
      <section className="text-center px-6 pt-20 pb-14 max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-indigo-900">
          About TravelCo
        </h1>
        <p className="mt-4 text-slate-500 text-lg">
          We help you discover the world with curated travel experiences and seamless bookings.
        </p>
      </section>

      {/* ── CONTENT ── */}
      <section className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

        {/* Image */}
        <div>
          <img
            src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1"
            alt="Travel"
            className="rounded-3xl shadow-xl w-full h-[280px] sm:h-[350px] object-cover"
          />
        </div>

        {/* Text */}
        <div>
          <h2 className="text-2xl font-bold text-indigo-800 mb-3">
            Our Mission
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            At TravelCo, our mission is to make travel simple, affordable, and
            unforgettable. Whether you're exploring beaches, mountains, or
            cities, we provide handpicked destinations and seamless booking
            experiences.
          </p>

          <h2 className="text-2xl font-bold text-indigo-800 mt-6 mb-3">
            Why Choose Us?
          </h2>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>✔ Curated destinations</li>
            <li>✔ Affordable pricing</li>
            <li>✔ Easy booking process</li>
            <li>✔ 24/7 support</li>
          </ul>
        </div>

      </section>

      {/* ── STATS ── */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">

        {[
          { number: "500+", label: "Destinations" },
          { number: "10K+", label: "Happy Travelers" },
          { number: "4.8⭐", label: "Average Rating" },
          { number: "24/7", label: "Support" },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white/70 backdrop-blur rounded-2xl p-6 shadow-md border border-indigo-100"
          >
            <p className="text-2xl font-bold text-indigo-700">
              {item.number}
            </p>
            <p className="text-sm text-slate-500 mt-1">{item.label}</p>
          </div>
        ))}

      </section>

    </div>
  );
}

export default About;