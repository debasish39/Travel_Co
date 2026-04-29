import { useParams, useNavigate } from "react-router-dom";
import { destinations } from "../data/data";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN").format(price);

// Derive extra visual info from region
const REGION_META = {
  asia:     { emoji: "🌏", color: "from-orange-400 to-rose-500" },
  europe:   { emoji: "🏰", color: "from-indigo-400 to-blue-500" },
  americas: { emoji: "🗽", color: "from-cyan-400 to-teal-500" },
  africa:   { emoji: "🌅", color: "from-amber-400 to-orange-500" },
  oceania:  { emoji: "🐚", color: "from-emerald-400 to-teal-500" },
};

function DestinationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const data = destinations.find((d) => d.id.toString() === id);
  const meta = REGION_META[data?.region?.toLowerCase()] ?? { emoji: "📍", color: "from-indigo-400 to-blue-500" };

  // ── Not Found ──
  if (!data) {
    return (
      <>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');`}</style>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-white gap-5">
          <div className="text-7xl">🗺️</div>
          <h2 className="text-2xl font-bold text-indigo-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            Destination Not Found
          </h2>
          <p className="text-slate-400 text-sm">We couldn't locate this destination.</p>
          <button
            onClick={() => navigate("/destinations")}
            className="mt-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all"
          >
            ← Back to Destinations
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .dd-page * { font-family: 'DM Sans', sans-serif; }
        .dd-serif  { font-family: 'Playfair Display', serif; }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(28px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity:0; } to { opacity:1; }
        }
        @keyframes scaleIn {
          from { opacity:0; transform:scale(0.94); }
          to   { opacity:1; transform:scale(1); }
        }
        @keyframes slideRight {
          from { opacity:0; transform:translateX(-16px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes blobDrift {
          0%,100% { transform:translate(0,0) scale(1);      border-radius:60% 40% 55% 45%/50% 60% 40% 50%; }
          40%      { transform:translate(20px,-18px) scale(1.05); border-radius:40% 60% 45% 55%/60% 40% 55% 45%; }
          70%      { transform:translate(-12px,12px) scale(0.96); border-radius:55% 45% 60% 40%/45% 55% 45% 55%; }
        }
        @keyframes shimmer {
          0%   { background-position:-200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes kenBurns {
          from { transform:scale(1); }
          to   { transform:scale(1.08); }
        }

        .hero-img   { animation:kenBurns 12s ease-in-out infinite alternate; }
        .fade-in    { animation:fadeIn  0.7s ease both; }
        .fade-up    { animation:fadeUp  0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .scale-in   { animation:scaleIn 0.65s cubic-bezier(0.22,1,0.36,1) both; }
        .slide-r    { animation:slideRight 0.55s cubic-bezier(0.22,1,0.36,1) both; }

        .blob1 { animation:blobDrift 10s ease-in-out infinite; }
        .blob2 { animation:blobDrift 13s ease-in-out infinite reverse; }

        .book-btn {
          background: linear-gradient(135deg,#4338ca 0%,#3b82f6 60%,#6366f1 100%);
          background-size:200% 100%;
          transition:background-position 0.45s ease, transform 0.22s, box-shadow 0.22s;
        }
        .book-btn:hover {
          background-position:right center;
          transform:translateY(-2px);
          box-shadow:0 18px 44px rgba(79,70,229,0.42);
        }
        .book-btn::after {
          content:'';
          position:absolute; inset:0;
          border-radius:inherit;
          background:linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.15) 50%,transparent 65%);
          background-size:200% 100%;
          animation:shimmer 2.6s infinite;
        }

        .back-btn { transition:all 0.2s ease; }
        .back-btn:hover { background:rgba(99,102,241,0.08); color:#4f46e5; transform:translateX(-3px); }

        .stat-card { transition:transform 0.25s ease, box-shadow 0.25s ease; }
        .stat-card:hover { transform:translateY(-4px); box-shadow:0 12px 32px rgba(79,70,229,0.12); }
      `}</style>

      <div className="dd-page min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-white relative overflow-x-hidden">

        {/* Blobs */}
        <div className="blob1 pointer-events-none absolute -top-32 -left-32 w-[480px] h-[480px] bg-indigo-200/25 blur-3xl" />
        <div className="blob2 pointer-events-none absolute top-1/2 -right-40 w-[400px] h-[400px] bg-blue-200/20 blur-3xl" />

        {/* Dot grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage:"radial-gradient(circle,#4f46e5 1.2px,transparent 1.2px)", backgroundSize:"30px 30px" }} />

        <div className="relative z-10 max-w-5xl mx-auto px-5 py-10">

          {/* ── BACK BUTTON ── */}
          <button
            onClick={() => navigate(-1)}
            className="slide-r back-btn flex items-center gap-2 text-sm font-semibold text-slate-500 bg-white/60 backdrop-blur border border-white/80 px-4 py-2 rounded-xl mb-8 shadow-sm"
            style={{ animationDelay:"0s" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>

          {/* ── HERO IMAGE ── */}
          <div className="scale-in relative w-full h-[420px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl shadow-indigo-200/50 mb-0"
            style={{ animationDelay:"0.05s" }}>
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={data.image || DEFAULT_IMAGE}
                alt={data.name}
                onError={(e) => (e.target.src = DEFAULT_IMAGE)}
                className="hero-img w-full h-full object-cover"
              />
            </div>
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/80 via-indigo-900/20 to-transparent" />

            {/* Top badges */}
            <div className="absolute top-5 left-5 flex gap-2">
              <span className={`flex items-center gap-1.5 bg-gradient-to-r ${meta.color} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md`}>
                {meta.emoji} {data.region}
              </span>
            </div>
            <div className="absolute top-5 right-5">
              <span className="flex items-center gap-1 bg-amber-400 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                ⭐ {data.rating}
              </span>
            </div>

            {/* Hero text */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <p className="text-indigo-300 text-xs font-semibold tracking-[0.18em] uppercase mb-2">
                📍 {data.region}
              </p>
              <h1 className="dd-serif text-4xl md:text-5xl font-extrabold text-white leading-tight drop-shadow-xl">
                {data.name}
              </h1>
            </div>
          </div>

          {/* ── FLOATING DETAIL CARD ── */}
          <div className="fade-up relative z-20 -mt-6 mx-4 bg-white/80 backdrop-blur-xl border border-white/90 rounded-3xl shadow-xl shadow-indigo-100/60 p-7 mb-8"
            style={{ animationDelay:"0.18s" }}>

            {/* Stats row */}
            <div className="grid grid-cols-3 divide-x divide-indigo-100 mb-7">
              {[
                {
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" fill="currentColor"/>
                    </svg>
                  ),
                  label: "Destination",
                  value: data.name,
                },
                {
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  ),
                  label: "Duration",
                  value: data.duration || "Flexible",
                },
                {
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ),
                  label: "Rating",
                  value: `${data.rating} / 5`,
                },
              ].map(({ icon, label, value }) => (
                <div key={label} className="stat-card flex flex-col items-center text-center px-4 py-2 first:pl-0 last:pr-0">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 mb-2">
                    {icon}
                  </div>
                  <p className="text-[10px] font-semibold text-slate-400 tracking-widest uppercase mb-0.5">{label}</p>
                  <p className="text-sm font-bold text-indigo-900 truncate max-w-full">{value}</p>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent mb-6" />

            {/* Description */}
            <div className="mb-7">
              <h2 className="dd-serif text-xl font-bold text-indigo-950 mb-3">About This Destination</h2>
              <p className="text-slate-500 leading-relaxed text-sm">
                {data.description}
              </p>
            </div>

            {/* Price + CTA row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 pt-5 border-t border-indigo-100">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.15em] text-slate-400 uppercase mb-1">Starting from</p>
                <div className="flex items-baseline gap-1">
                  <span className="dd-serif text-4xl font-extrabold text-indigo-600 leading-none">
                    ₹{formatPrice(data.price)}
                  </span>
                  <span className="text-slate-400 text-sm font-normal">/ person</span>
                </div>
              </div>

              <button
                onClick={() =>
                  navigate("/booking", {
                    state: {
                      pkg: {
                        ...data,
                        title: data.name,
                        duration: data.duration || "Flexible Plan",
                      },
                    },
                  })
                }
                className="book-btn relative overflow-hidden w-full sm:w-auto flex items-center justify-center gap-3 text-white font-bold text-base px-8 py-4 rounded-2xl"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="relative z-10">
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="relative z-10">Book Now</span>
              </button>
            </div>

          </div>

          {/* ── HIGHLIGHTS STRIP ── */}
          <div className="fade-up grid grid-cols-2 md:grid-cols-4 gap-4" style={{ animationDelay:"0.3s" }}>
            {[
              { icon: "✈️", label: "Easy Booking",    sub: "Instant confirmation" },
              { icon: "🛡️", label: "Safe Travel",     sub: "Verified destinations" },
              { icon: "💳", label: "Best Price",       sub: "No hidden charges" },
              { icon: "🎯", label: "Curated Picks",   sub: "Expert recommended" },
            ].map(({ icon, label, sub }) => (
              <div key={label}
                className="stat-card bg-white/60 backdrop-blur border border-white/80 rounded-2xl px-4 py-4 flex items-center gap-3 shadow-sm">
                <span className="text-2xl">{icon}</span>
                <div>
                  <p className="text-xs font-bold text-indigo-900">{label}</p>
                  <p className="text-[10px] text-slate-400">{sub}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}

export default DestinationDetails;