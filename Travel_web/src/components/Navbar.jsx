import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaInfoCircle,
  FaMapMarkedAlt,
  FaSuitcase,
  FaEnvelope,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useState, useEffect } from "react";

const NAV_ITEMS = [
  { path: "/",            label: "Home",         icon: <FaHome /> },
  { path: "/about",       label: "About",        icon: <FaInfoCircle /> },
  { path: "/destinations",label: "Destinations", icon: <FaMapMarkedAlt /> },
  { path: "/packages",    label: "Packages",     icon: <FaSuitcase /> },
  { path: "/contact",     label: "Contact",      icon: <FaEnvelope /> },
];

function Navbar() {
  const location  = useLocation();
  const [isOpen,     setIsOpen]     = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const [activeIdx,  setActiveIdx]  = useState(null);

  // Shrink nav on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600;700&display=swap');

        .nav-root * { font-family: 'DM Sans', sans-serif; }
        .nav-logo    { font-family: 'Playfair Display', serif; }

        @keyframes navSlideDown {
          from { opacity:0; transform:translateY(-14px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes drawerIn {
          from { transform:translateX(-100%); opacity:0.6; }
          to   { transform:translateX(0);     opacity:1; }
        }
        @keyframes drawerOut {
          from { transform:translateX(0);     opacity:1; }
          to   { transform:translateX(-100%); opacity:0.6; }
        }
        @keyframes overlayIn  { from{opacity:0} to{opacity:1} }
        @keyframes overlayOut { from{opacity:1} to{opacity:0} }
        @keyframes shimmer {
          0%   { background-position:-200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes floatPlane {
          0%,100% { transform:translateX(0) translateY(0) rotate(-5deg); }
          50%      { transform:translateX(4px) translateY(-3px) rotate(-5deg); }
        }
        @keyframes drawerItemIn {
          from { opacity:0; transform:translateX(-14px); }
          to   { opacity:1; transform:translateX(0); }
        }

        .nav-animate { animation:navSlideDown 0.55s cubic-bezier(0.22,1,0.36,1) both; }
        .plane-float { animation:floatPlane 3s ease-in-out infinite; display:inline-block; }

        /* Active pill indicator */
        .nav-pill-active {
          background: rgba(255,255,255,0.18);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.25), 0 2px 12px rgba(79,70,229,0.25);
        }
        .nav-pill-active::before {
          content:'';
          position:absolute; bottom:-1px; left:50%; transform:translateX(-50%);
          width:18px; height:2.5px; border-radius:999px;
          background:white;
        }

        .nav-link {
          position:relative;
          transition:background 0.2s ease, color 0.2s ease, transform 0.18s ease;
        }
        .nav-link:hover:not(.active-link) {
          background:rgba(255,255,255,0.1);
          transform:translateY(-1px);
        }
        .nav-link:active { transform:scale(0.96); }

        /* Shimmer Book btn */
        .cta-btn {
          background:linear-gradient(135deg,#fff 0%,#e0e7ff 100%);
          background-size:200% 100%;
          transition:background-position 0.4s ease, box-shadow 0.25s, transform 0.2s;
          position:relative; overflow:hidden;
        }
        .cta-btn:hover {
          background-position:right center;
          box-shadow:0 6px 24px rgba(255,255,255,0.3);
          transform:translateY(-1px);
        }
        .cta-btn::after {
          content:'';
          position:absolute; inset:0; border-radius:inherit;
          background:linear-gradient(105deg,transparent 35%,rgba(99,102,241,0.15) 50%,transparent 65%);
          background-size:200% 100%;
          animation:shimmer 2.8s infinite;
        }

        /* Hamburger lines */
        .ham-line { transition:all 0.3s cubic-bezier(0.68,-0.55,0.27,1.55); }

        /* Drawer items stagger */
        .drawer-item { animation:drawerItemIn 0.4s cubic-bezier(0.22,1,0.36,1) both; }
        .drawer-item:nth-child(1){animation-delay:0.08s}
        .drawer-item:nth-child(2){animation-delay:0.13s}
        .drawer-item:nth-child(3){animation-delay:0.18s}
        .drawer-item:nth-child(4){animation-delay:0.23s}
        .drawer-item:nth-child(5){animation-delay:0.28s}

        .drawer-link {
          transition:background 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .drawer-link:hover:not(.drawer-active) {
          background:rgba(255,255,255,0.1);
          transform:translateX(4px);
        }
        .drawer-active {
          background:rgba(255,255,255,0.18);
          box-shadow:inset 0 0 0 1px rgba(255,255,255,0.25);
        }

        /* Scrolled state — shadow deepens */
        .nav-scrolled {
          box-shadow:0 4px 32px rgba(79,70,229,0.28), 0 1px 0 rgba(255,255,255,0.1) inset;
        }
      `}</style>

      {/* ═══════════════════ NAVBAR ═══════════════════ */}
      <nav className={`nav-root nav-animate sticky top-0 z-50 transition-all duration-300
        ${scrolled
          ? "nav-scrolled bg-gradient-to-r from-indigo-800/95 via-blue-700/95 to-indigo-800/95 backdrop-blur-2xl h-14"
          : "bg-gradient-to-r from-indigo-700/92 via-blue-600/92 to-indigo-700/92 backdrop-blur-xl h-16"
        }
        border-b border-white/10`}
      >
        {/* Subtle inner shimmer strip */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-5 h-full flex items-center justify-between gap-6">

          {/* ── LOGO ── */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shadow-inner">
              <span className="plane-float text-lg leading-none">✈️</span>
            </div>
            <span className="nav-logo text-xl font-bold text-white tracking-tight leading-none">
              TravelCo
            </span>
          </Link>

          {/* ── DESKTOP NAV ── */}
          <div className="hidden md:flex items-center gap-1 bg-white/10 backdrop-blur px-2 py-1.5 rounded-full border border-white/12 shadow-inner">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium tracking-wide
                    ${isActive
                      ? "nav-pill-active active-link text-white"
                      : "text-white/75 hover:text-white"
                    }`}
                >
                  <span className={`text-xs transition-transform duration-200 ${isActive ? "scale-110" : "scale-100"}`}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* ── RIGHT SIDE ── */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <Link
              to="/track-booking"
              className="cta-btn flex items-center gap-2 text-indigo-700 font-semibold text-sm px-5 py-2 rounded-full shadow-md"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="relative z-10">
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span className="relative z-10">Track Booking</span>
            </Link>
          </div>

          {/* ── MOBILE HAMBURGER ── */}
          <button
            className="md:hidden relative w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-xl bg-white/10 border border-white/15 hover:bg-white/20 transition-colors"
            onClick={() => setIsOpen(true)}
            aria-label="Open menu"
          >
            <span className="ham-line w-4.5 h-0.5 bg-white rounded-full" style={{ width: "18px", height: "2px" }} />
            <span className="ham-line w-3 h-0.5 bg-white/70 rounded-full" style={{ width: "12px", height: "2px" }} />
            <span className="ham-line w-4.5 h-0.5 bg-white rounded-full" style={{ width: "18px", height: "2px" }} />
          </button>

        </div>

        {/* Bottom inner glow line */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-indigo-300/20 to-transparent pointer-events-none" />
      </nav>

      {/* ═══════════════════ OVERLAY ═══════════════════ */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-indigo-950/50 backdrop-blur-sm"
          style={{ animation: "overlayIn 0.25s ease both" }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ═══════════════════ DRAWER ═══════════════════ */}
      <div
        className={`fixed top-0 left-0 h-full w-72 z-50 flex flex-col
          bg-gradient-to-b from-indigo-800 via-indigo-700 to-blue-700
          border-r border-white/10 shadow-2xl shadow-indigo-900/60
          transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Dot grid overlay */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage:"radial-gradient(circle,white 1px,transparent 1px)", backgroundSize:"22px 22px" }} />

        {/* Drawer header */}
        <div className="relative flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/15 border border-white/20 flex items-center justify-center">
              <span className="text-base leading-none">✈️</span>
            </div>
            <span className="nav-logo text-lg font-bold text-white tracking-tight">TravelCo</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close menu"
          >
            <FaTimes size={14} />
          </button>
        </div>

        {/* Nav links */}
        <div className="relative flex-1 flex flex-col px-3 py-4 gap-1 overflow-y-auto">
          {NAV_ITEMS.map((item, i) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`drawer-item drawer-link flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-medium
                  ${isActive
                    ? "drawer-active text-white"
                    : "text-white/70 hover:text-white"
                  }`}
                style={{ animationDelay: `${0.06 + i * 0.05}s` }}
              >
                {/* Icon chip */}
                <span className={`w-8 h-8 flex items-center justify-center rounded-xl text-xs flex-shrink-0
                  ${isActive
                    ? "bg-white text-indigo-600 shadow-md"
                    : "bg-white/10 text-white/70"
                  }`}>
                  {item.icon}
                </span>
                <span className="font-semibold tracking-wide">{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70 flex-shrink-0" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Drawer footer CTA */}
        <div className="relative px-4 pb-6 pt-3 border-t border-white/10">
          <p className="text-white/40 text-[10px] tracking-widest uppercase font-semibold mb-3 px-1">
            Ready to travel?
          </p>
          <Link
            to="/track-booking"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center gap-2 w-full bg-white text-indigo-700 font-bold text-sm py-3 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Track Booking
          </Link>
        </div>
      </div>
    </>
  );
}

export default Navbar;