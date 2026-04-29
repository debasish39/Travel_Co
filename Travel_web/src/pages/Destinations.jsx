import { useState } from "react";
import { destinations } from "../data/data";
import { useNavigate } from "react-router-dom";

const REGIONS = ["all", "asia", "europe", "americas", "africa", "oceania"];
const REGION_LABELS = {
  all: "🌍 All",
  asia: "🌏 Asia",
  europe: "🏰 Europe",
  americas: "🗽 Americas",
  africa: "🌅 Africa",
  oceania: "🐚 Oceania",
};

function Destinations() {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const navigate = useNavigate();

  const filteredData = destinations.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchRegion = region === "all" || item.region.toLowerCase() === region;
    return matchSearch && matchRegion;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleSearch = (e) => { setSearch(e.target.value); setCurrentPage(1); };
  const handleRegion = (r) => { setRegion(r); setCurrentPage(1); };
const getPagination = (currentPage, totalPages) => {
  const pages = [];

  if (totalPages <= 3) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  pages.push(1);

  if (currentPage > 3) {
    pages.push("...");
  }

  for (let i = currentPage - 1; i <= currentPage + 1; i++) {
    if (i > 1 && i < totalPages) {
      pages.push(i);
    }
  }

  if (currentPage < totalPages - 2) {
    pages.push("...");
  }

  pages.push(totalPages);

  return pages;
};
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        .dest-page * { font-family: 'DM Sans', sans-serif; }
        .dest-heading { font-family: 'Playfair Display', serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes blobDrift {
          0%, 100% { transform: translate(0,0) scale(1); border-radius: 60% 40% 55% 45%/50% 60% 40% 50%; }
          40%       { transform: translate(20px,-20px) scale(1.06); border-radius: 40% 60% 45% 55%/60% 40% 55% 45%; }
          70%       { transform: translate(-12px,14px) scale(0.96); border-radius: 55% 45% 60% 40%/45% 55% 45% 55%; }
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }

        .page-enter  { animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }
        .card-enter  { animation: cardIn 0.5s cubic-bezier(0.22,1,0.36,1) both; }
        .card-enter:nth-child(1){animation-delay:0.03s}
        .card-enter:nth-child(2){animation-delay:0.07s}
        .card-enter:nth-child(3){animation-delay:0.11s}
        .card-enter:nth-child(4){animation-delay:0.15s}
        .card-enter:nth-child(5){animation-delay:0.19s}
        .card-enter:nth-child(6){animation-delay:0.23s}
        .card-enter:nth-child(7){animation-delay:0.27s}
        .card-enter:nth-child(8){animation-delay:0.31s}

        .blob1 { animation: blobDrift 10s ease-in-out infinite; }
        .blob2 { animation: blobDrift 13s ease-in-out infinite reverse; }

        .dest-card {
          transition: transform 0.32s cubic-bezier(0.34,1.4,0.64,1), box-shadow 0.3s ease;
        }
        .dest-card:hover {
          transform: translateY(-6px) scale(1.015);
          box-shadow: 0 24px 60px rgba(79,70,229,0.2), 0 8px 24px rgba(0,0,0,0.08);
        }
        .dest-card:hover .card-img { transform: scale(1.1); }
        .dest-card:hover .card-overlay { opacity: 1; }
        .dest-card:hover .card-explore { transform: translateY(0); opacity: 1; }

        .card-img { transition: transform 0.5s cubic-bezier(0.22,1,0.36,1); }
        .card-overlay { opacity: 0; transition: opacity 0.3s ease; }
        .card-explore { transform: translateY(8px); opacity: 0; transition: transform 0.3s ease 0.05s, opacity 0.3s ease 0.05s; }

        .search-input:focus { box-shadow: 0 0 0 3px rgba(99,102,241,0.2); }
        .region-btn { transition: all 0.2s ease; }
        .region-btn.active {
          background: linear-gradient(135deg, #4f46e5, #3b82f6);
          color: white;
          box-shadow: 0 4px 14px rgba(79,70,229,0.35);
        }

        .page-btn { transition: all 0.2s ease; }
        .page-btn:hover:not(.active-page) { border-color: #6366f1; color: #4f46e5; transform: translateY(-1px); }
        .page-btn.active-page {
          background: linear-gradient(135deg, #4f46e5, #3b82f6);
          color: white;
          border-color: transparent;
          box-shadow: 0 4px 14px rgba(79,70,229,0.35);
        }

        .search-wrapper::before {
          content: '';
          position: absolute; inset: -1px;
          border-radius: 17px;
          background: linear-gradient(135deg, #6366f1, #3b82f6);
          z-index: -1;
          opacity: 0;
          transition: opacity 0.25s;
        }
        .search-wrapper:focus-within::before { opacity: 1; }

        .rating-badge {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          box-shadow: 0 2px 8px rgba(245,158,11,0.45);
        }
        .price-tag {
          background: linear-gradient(135deg, #ecfdf5, #d1fae5);
          border: 1px solid #6ee7b7;
        }
      `}</style>

      <div className="dest-page min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-white relative overflow-x-hidden">

        {/* Blobs */}
        <div className="blob1 pointer-events-none absolute -top-32 -left-32 w-[500px] h-[500px] bg-indigo-200/30 blur-3xl" />
        <div className="blob2 pointer-events-none absolute top-1/3 -right-40 w-[420px] h-[420px] bg-blue-200/25 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-indigo-100/40 rounded-full blur-3xl" />

        {/* Dot grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle, #4f46e5 1.2px, transparent 1.2px)", backgroundSize: "30px 30px" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-14">

          {/* ── HERO HEADER ── */}
          <div className="page-enter text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur border border-indigo-100 rounded-full px-4 py-1.5 text-xs font-semibold text-indigo-500 tracking-widest uppercase mb-5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse inline-block" />
              {filteredData.length} Destinations Available
            </div>
            <h1 className="dest-heading text-5xl md:text-6xl font-extrabold text-indigo-950 leading-tight mb-4">
              Explore the World
            </h1>
            <p className="text-slate-500 text-lg max-w-xl mx-auto font-light">
              Handpicked destinations for every kind of traveller. Find your next escape.
            </p>
          </div>

          {/* ── FILTERS ── */}
          <div className="page-enter mb-10 space-y-5" style={{ animationDelay: "0.1s" }}>

            {/* Search */}
            <div className="search-wrapper relative max-w-xl mx-auto rounded-2xl" style={{ position: "relative", zIndex: 0 }}>
              <div className="relative flex items-center bg-white/80 backdrop-blur border border-indigo-100 rounded-2xl shadow-sm overflow-hidden">
                <svg className="absolute left-4 text-indigo-400" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                  <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search destinations…"
                  className="search-input w-full bg-transparent pl-12 pr-5 py-3.5 text-sm text-slate-700 placeholder-slate-400 outline-none font-medium"
                  value={search}
                  onChange={handleSearch}
                />
                {search && (
                  <button onClick={() => { setSearch(""); setCurrentPage(1); }}
                    className="absolute right-4 text-slate-400 hover:text-indigo-500 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Region pills */}
            <div className="flex flex-wrap justify-center gap-2.5">
              {REGIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => handleRegion(r)}
                  className={`region-btn px-4 py-2 rounded-full text-sm font-semibold border border-indigo-100 bg-white/70 backdrop-blur text-slate-600 shadow-sm ${region === r ? "active" : "hover:border-indigo-300 hover:text-indigo-600"}`}
                >
                  {REGION_LABELS[r]}
                </button>
              ))}
            </div>
          </div>

          {/* ── CARDS GRID ── */}
          {currentData.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">🗺️</div>
              <p className="text-slate-400 text-lg font-medium">No destinations found.</p>
              <p className="text-slate-300 text-sm mt-1">Try a different search or region.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentData.map((item) => (
                <div
                  key={item.id}
                  className="card-enter dest-card cursor-pointer bg-white rounded-3xl overflow-hidden shadow-md border border-white/80"
                  onClick={() => navigate(`/destination/${item.id}`)}
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="card-img h-full w-full object-cover"
                    />
                    {/* Hover overlay */}
                    <div className="card-overlay absolute inset-0 bg-gradient-to-t from-indigo-900/70 via-indigo-900/20 to-transparent" />

                    {/* Rating badge */}
                    <span className="rating-badge absolute top-3 left-3 flex items-center gap-1 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      ⭐ {item.rating}
                    </span>

                    {/* Region tag */}
                    <span className="absolute top-3 right-3 bg-white/20 backdrop-blur text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/30">
                      {item.region}
                    </span>

                    {/* Name on image */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h2 className="text-white text-lg font-bold leading-tight drop-shadow-lg">{item.name}</h2>
                      <div className="card-explore flex items-center gap-1 text-indigo-200 text-xs font-medium mt-1">
                        <span>Explore</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4">
                    <p className="text-slate-500 text-xs leading-relaxed mb-3 line-clamp-2 font-normal">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="price-tag rounded-xl px-3 py-1.5">
                        <p className="text-emerald-700 font-bold text-sm">₹{item.price?.toLocaleString("en-IN")}</p>
                      </div>
                      <div className="flex items-center gap-1 text-indigo-500 text-xs font-semibold">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                            fill="currentColor"/>
                        </svg>
                        View Details
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── PAGINATION ── */}
    {totalPages > 1 && (
  <div className="flex flex-col items-center mt-12">

<div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto px-2 no-scrollbar">      
      {/* Prev */}
      <button
        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
        disabled={currentPage === 1}
        className="page-btn w-9 h-9 flex items-center justify-center rounded-xl border border-indigo-100 bg-white/70 text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:border-indigo-300 hover:text-indigo-500 shadow-sm"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Pages with ... */}
      {getPagination(currentPage, totalPages).map((p, i) =>
        p === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="w-9 h-9 flex items-center justify-center text-slate-400"
          >
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => setCurrentPage(p)}
            className={`page-btn w-9 h-9 flex items-center justify-center rounded-xl border text-sm font-semibold shadow-sm bg-white/70 backdrop-blur ${
              currentPage === p
                ? "active-page"
                : "border-indigo-100 text-slate-500"
            }`}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() =>
          setCurrentPage((p) => Math.min(p + 1, totalPages))
        }
        disabled={currentPage === totalPages}
        className="page-btn w-9 h-9 flex items-center justify-center rounded-xl border border-indigo-100 bg-white/70 text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:border-indigo-300 hover:text-indigo-500 shadow-sm"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

    </div>

    {/* Page info */}
    <p className="text-center text-xs text-slate-400 mt-3 font-medium">
      Showing {startIndex + 1}–
      {Math.min(startIndex + itemsPerPage, filteredData.length)} of{" "}
      {filteredData.length} destinations
    </p>

  </div>
)}

    

        </div>
      </div>
    </>
  );
}

export default Destinations;