import { useState } from "react";
import { packages } from "../data/packages";
import { useNavigate } from "react-router-dom";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";

const RATING_OPTIONS = [
  { label: "All Ratings", value: 0 },
  { label: "4★ & above", value: 4 },
  { label: "4.5★ & above", value: 4.5 },
];

const SORT_OPTIONS = [
  { label: "Featured", value: "" },
  { label: "Price: Low → High", value: "low" },
  { label: "Price: High → Low", value: "high" },
  { label: "Top Rated", value: "rating" },
];

export default function Packages() {
  const [search, setSearch] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("");
  const [hoveredId, setHoveredId] = useState(null);
  const navigate = useNavigate();

  let filtered = packages
    .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => p.rating >= minRating);

  if (sort === "low")    filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === "high")   filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sort === "rating") filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  const formatPrice = (p) => new Intl.NumberFormat("en-IN").format(p);

  // Star renderer
  const Stars = ({ rating }) => {
    const full  = Math.floor(rating);
    const half  = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return (
      <span className="flex items-center gap-0.5">
        {[...Array(full)].map((_,i)  => <span key={`f${i}`} className="text-amber-400 text-xs">★</span>)}
        {half                          && <span className="text-amber-300 text-xs">½</span>}
        {[...Array(empty)].map((_,i)  => <span key={`e${i}`} className="text-slate-300 text-xs">★</span>)}
        <span className="text-slate-500 text-xs ml-1 font-medium">{rating}</span>
      </span>
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .pkg-page * { font-family: 'DM Sans', sans-serif; }
        .pkg-serif  { font-family: 'Playfair Display', serif; }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes cardIn {
          from { opacity:0; transform:translateY(18px) scale(0.96); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes shimmer {
          0%   { background-position:-200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes blobDrift {
          0%,100% { transform:translate(0,0) scale(1);       border-radius:60% 40% 55% 45%/50% 60% 40% 50%; }
          40%      { transform:translate(22px,-20px) scale(1.06); border-radius:40% 60% 45% 55%/60% 40% 55% 45%; }
          70%      { transform:translate(-14px,12px) scale(0.96); border-radius:55% 45% 60% 40%/45% 55% 45% 55%; }
        }
        @keyframes slideDown {
          from { opacity:0; transform:translateY(-12px); }
          to   { opacity:1; transform:translateY(0); }
        }

        .blob1 { animation:blobDrift 10s ease-in-out infinite; }
        .blob2 { animation:blobDrift 13s ease-in-out infinite reverse; }
        .blob3 { animation:blobDrift 16s ease-in-out infinite 2s; }

        .fade-up    { animation:fadeUp  0.65s cubic-bezier(0.22,1,0.36,1) both; }
        .card-enter { animation:cardIn  0.5s  cubic-bezier(0.22,1,0.36,1) both; }
        .slide-down { animation:slideDown 0.5s cubic-bezier(0.22,1,0.36,1) both; }

        .card-enter:nth-child(1){animation-delay:0.04s}
        .card-enter:nth-child(2){animation-delay:0.09s}
        .card-enter:nth-child(3){animation-delay:0.14s}
        .card-enter:nth-child(4){animation-delay:0.19s}
        .card-enter:nth-child(5){animation-delay:0.24s}
        .card-enter:nth-child(6){animation-delay:0.29s}

        .pkg-card {
          transition: transform 0.32s cubic-bezier(0.34,1.4,0.64,1),
                      box-shadow 0.3s ease;
        }
        .pkg-card:hover {
          transform: translateY(-8px) scale(1.018);
          box-shadow: 0 28px 64px rgba(79,70,229,0.2), 0 8px 24px rgba(0,0,0,0.07);
        }
        .pkg-card:hover .pkg-img  { transform:scale(1.1); }
        .pkg-card:hover .img-overlay { opacity:1; }
        .pkg-card:hover .book-cta { transform:translateY(0); opacity:1; }

        .pkg-img      { transition:transform 0.55s cubic-bezier(0.22,1,0.36,1); }
        .img-overlay  { opacity:0; transition:opacity 0.3s ease; }
        .book-cta     { transform:translateY(10px); opacity:0; transition:transform 0.3s ease 0.05s, opacity 0.3s ease 0.05s; }

        .book-btn {
          background:linear-gradient(135deg,#4338ca 0%,#3b82f6 60%,#6366f1 100%);
          background-size:200% 100%;
          transition:background-position 0.45s ease, transform 0.2s, box-shadow 0.2s;
          position:relative; overflow:hidden;
        }
        .book-btn:hover {
          background-position:right center;
          transform:translateY(-1px);
          box-shadow:0 10px 30px rgba(79,70,229,0.4);
        }
        .book-btn::after {
          content:'';
          position:absolute; inset:0; border-radius:inherit;
          background:linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.15) 50%,transparent 65%);
          background-size:200% 100%;
          animation:shimmer 2.6s infinite;
        }

        .filter-select {
          appearance:none;
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M6 9l6 6 6-6' stroke='%236366f1' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat:no-repeat;
          background-position:right 12px center;
          padding-right:36px !important;
        }
        .filter-select:focus { box-shadow:0 0 0 3px rgba(99,102,241,0.2); }
        .search-input:focus  { box-shadow:0 0 0 3px rgba(99,102,241,0.2); }

        .empty-state { animation:fadeUp 0.6s ease both; }
      `}</style>

      <div className="pkg-page min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-white relative overflow-hidden">

        {/* Background blobs */}
        <div className="blob1 pointer-events-none absolute -top-36 -left-36 w-[500px] h-[500px] bg-indigo-200/28 blur-3xl" />
        <div className="blob2 pointer-events-none absolute top-1/3 -right-44 w-[440px] h-[440px] bg-blue-200/22 blur-3xl" />
        <div className="blob3 pointer-events-none absolute -bottom-32 left-1/3 w-[360px] h-[360px] bg-indigo-100/35 blur-3xl" />

        {/* Dot grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.036]"
          style={{ backgroundImage:"radial-gradient(circle,#4f46e5 1.2px,transparent 1.2px)", backgroundSize:"30px 30px" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-14">

          {/* ── HERO HEADER ── */}
          <div className="fade-up text-center mb-14" style={{ animationDelay:"0s" }}>
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur border border-indigo-100 rounded-full px-4 py-1.5 text-xs font-semibold text-indigo-500 tracking-widest uppercase mb-5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse inline-block" />
              {filtered.length} Packages Available
            </div>
            <h1 className="pkg-serif text-5xl md:text-6xl font-extrabold text-indigo-950 leading-tight mb-4">
              Travel Packages
            </h1>
            <p className="text-slate-500 text-lg max-w-xl mx-auto font-light">
              Curated escapes for every budget. Book your dream trip in seconds.
            </p>
          </div>

          {/* ── FILTER BAR ── */}
          <div className="slide-down bg-white/70 backdrop-blur border border-white/80 rounded-3xl shadow-md shadow-indigo-100/50 px-6 py-5 mb-10 flex flex-col md:flex-row gap-4 items-stretch md:items-center"
            style={{ animationDelay:"0.1s" }}>

            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                placeholder="Search packages…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input w-full bg-white/80 border border-indigo-100 rounded-2xl pl-11 pr-10 py-3 text-sm text-slate-700 placeholder-slate-400 outline-none font-medium transition-shadow"
              />
              {search && (
                <button onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              )}
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-8 bg-indigo-100" />

            {/* Rating filter */}
            <div className="relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="filter-select bg-white/80 border border-indigo-100 rounded-2xl pl-9 py-3 text-sm text-slate-600 font-medium outline-none transition-shadow cursor-pointer w-full md:w-44"
              >
                {RATING_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Sort filter */}
            <div className="relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M7 12h10M11 18h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="filter-select bg-white/80 border border-indigo-100 rounded-2xl pl-9 py-3 text-sm text-slate-600 font-medium outline-none transition-shadow cursor-pointer w-full md:w-48"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ── CARDS GRID ── */}
          {filtered.length === 0 ? (
            <div className="empty-state text-center py-28">
              <div className="text-6xl mb-4">🧳</div>
              <p className="text-slate-400 text-lg font-semibold">No packages found</p>
              <p className="text-slate-300 text-sm mt-1">Try adjusting your filters or search term.</p>
              <button onClick={() => { setSearch(""); setMinRating(0); setSort(""); }}
                className="mt-5 text-indigo-500 text-sm font-semibold border border-indigo-200 px-5 py-2 rounded-xl hover:bg-indigo-50 transition-colors">
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {filtered.map((pkg, idx) => (
                <div
                  key={pkg.id}
                  className="card-enter pkg-card bg-white rounded-3xl overflow-hidden border border-white/80 shadow-md cursor-pointer"
                  style={{ animationDelay: `${0.04 + idx * 0.05}s` }}
                  onClick={() => navigate("/booking", { state: { pkg } })}
                  onMouseEnter={() => setHoveredId(pkg.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={pkg.image || DEFAULT_IMAGE}
                      alt={pkg.title}
                      onError={(e) => (e.target.src = DEFAULT_IMAGE)}
                      className="pkg-img h-full w-full object-cover"
                    />

                    {/* Hover overlay */}
                    <div className="img-overlay absolute inset-0 bg-gradient-to-t from-indigo-950/75 via-indigo-900/20 to-transparent" />

                    {/* Rating badge */}
                    <span className="absolute top-3 left-3 flex items-center gap-1 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold px-2.5 py-1.5 rounded-full shadow-md">
                      ⭐ {pkg.rating}
                    </span>

                    {/* Duration badge */}
                    <span className="absolute top-3 right-3 bg-white/20 backdrop-blur text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1.5 rounded-full border border-white/25">
                      🕐 {pkg.duration}
                    </span>

                    {/* Hover CTA overlay */}
                    <div className="book-cta absolute bottom-4 left-0 right-0 flex justify-center">
                      <span className="flex items-center gap-2 bg-white/20 backdrop-blur text-white text-sm font-semibold px-5 py-2 rounded-full border border-white/30">
                        Book Now
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                          <path d="M5 12h14M13 6l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="p-5">
                    <h3 className="pkg-serif text-lg font-bold text-indigo-950 leading-snug mb-1 truncate">
                      {pkg.title}
                    </h3>

                    {/* Stars */}
                    <div className="mb-3">
                      <Stars rating={pkg.rating} />
                    </div>

                    {/* Description */}
                    {pkg.description && (
                      <p className="text-slate-400 text-xs leading-relaxed mb-4 line-clamp-2">
                        {pkg.description}
                      </p>
                    )}

                    {/* Price + CTA row */}
                    <div className="flex items-center justify-between pt-4 border-t border-indigo-50">
                      <div>
                        <p className="text-[9px] text-slate-400 font-semibold tracking-widest uppercase mb-0.5">From</p>
                        <p className="pkg-serif text-2xl font-extrabold text-indigo-600 leading-none">
                          ₹{formatPrice(pkg.price)}
                        </p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/booking", { state: { pkg } });
                        }}
                        className="book-btn flex items-center gap-2 text-white font-semibold text-sm px-5 py-2.5 rounded-xl"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="relative z-10">
                          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="relative z-10">Book</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results count */}
          {filtered.length > 0 && (
            <p className="text-center text-xs text-slate-400 mt-10 font-medium">
              Showing {filtered.length} package{filtered.length !== 1 ? "s" : ""}
              {search ? ` for "${search}"` : ""}
              {minRating > 0 ? ` · ${minRating}★ and above` : ""}
            </p>
          )}

        </div>
      </div>
    </>
  );
}