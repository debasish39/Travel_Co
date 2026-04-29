import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="relative  text-white">

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-500 to-blue-500" />

      {/* Glow effects */}
      <div className="absolute -top-20 left-1/4 w-[300px] h-[300px] bg-white/10 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-[250px] h-[250px] bg-blue-300/10 blur-3xl rounded-full" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">TravelCo</h2>
          <p className="text-indigo-100 text-sm mt-3 leading-relaxed">
            Discover curated destinations, seamless bookings, and unforgettable travel experiences across the globe.
          </p>

          {/* Social icons */}
          <div className="flex gap-3 mt-5">
            {["🌐", "📸", "🐦"].map((icon, i) => (
              <div
                key={i}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/10 backdrop-blur hover:bg-white/20 transition cursor-pointer"
              >
                {icon}
              </div>
            ))}
          </div>
        </div>

        {/* Explore */}
        <div>
          <h3 className="font-semibold mb-4 text-white/90">Explore</h3>
          <ul className="space-y-2 text-sm text-indigo-100">
            <li onClick={() => navigate("/destinations")} className="hover:text-white hover:translate-x-1 transition cursor-pointer">Destinations</li>
            <li className="hover:text-white hover:translate-x-1 transition cursor-pointer">Packages</li>
            <li className="hover:text-white hover:translate-x-1 transition cursor-pointer">Bookings</li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-semibold mb-4 text-white/90">Company</h3>
          <ul className="space-y-2 text-sm text-indigo-100">
            <li className="hover:text-white hover:translate-x-1 transition cursor-pointer">About Us</li>
            <li className="hover:text-white hover:translate-x-1 transition cursor-pointer">Contact</li>
            <li className="hover:text-white hover:translate-x-1 transition cursor-pointer">Careers</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-semibold mb-4 text-white/90">Stay Updated</h3>
          <p className="text-sm text-indigo-100 mb-3">
            Get travel deals & updates straight to your inbox.
          </p>

          <div className="flex items-center bg-white/10 backdrop-blur rounded-xl overflow-hidden">
            <input
              type="email"
              placeholder="Enter email"
              className="bg-transparent px-3 py-2 text-sm outline-none w-full placeholder-indigo-200"
            />
            <button className="px-4 py-2 bg-white text-indigo-600 font-semibold text-sm hover:bg-indigo-100 transition">
              Join
            </button>
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="relative z-10 border-t border-white/20 text-center py-4 text-xs sm:text-sm text-indigo-100 backdrop-blur">
        © {new Date().getFullYear()} TravelCo · All rights reserved
      </div>

    </footer>
  );
}

export default Footer;