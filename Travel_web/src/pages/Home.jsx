import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-white overflow-x-hidden">

      {/* ── HERO SECTION (FULL IMAGE) ── */}
      <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden">

        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1501785888041-af3ef285b470"
          alt="Travel Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/70 via-indigo-800/50 to-blue-600/40" />

        {/* Content */}
        <div className="relative z-10 px-6 max-w-3xl">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight">
            Discover Your Next
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-blue-200">
              Dream Destination
            </span>
          </h1>

          <p className="mt-5 text-indigo-100 text-lg">
            Explore curated travel experiences across the globe. Beaches, mountains, cities — all in one place.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate("/destinations")}
              className="px-6 py-3 rounded-xl bg-white text-indigo-600 font-semibold shadow-lg hover:scale-105 transition"
            >
              Explore Destinations
            </button>

            <button className="px-6 py-3 rounded-xl border border-white/40 text-white font-semibold hover:bg-white/10 transition">
              Learn More
            </button>
          </div>
        </div>
      </section>


    </div>
  );
}

export default Home;