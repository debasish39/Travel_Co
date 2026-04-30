import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Success() {
  const { bookingId } = useParams();
  const navigate      = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied,  setCopied]  = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res  = await fetch(`https://travel-co-from-gitmain.onrender.com/api/bookings/${bookingId}`);
        const data = await res.json();
        setBooking(data.success ? data.data : null);
      } catch (e) {
        console.error(e);
        setBooking(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" });
  const formatPrice = (p) =>
    new Intl.NumberFormat("en-IN").format(p);

  const copyId = () => {
    navigator.clipboard.writeText(booking?.bookingId || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Loading ──
  if (loading) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
          @keyframes spin{to{transform:rotate(360deg);}}
          .spinner{width:40px;height:40px;border:3px solid rgba(99,102,241,0.15);border-top-color:#6366f1;border-radius:50%;animation:spin 0.8s linear infinite;}
        `}</style>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-white gap-4"
          style={{ fontFamily:"'DM Sans',sans-serif" }}>
          <div className="spinner" />
          <p className="text-slate-400 text-sm font-medium tracking-wide">Fetching your booking…</p>
        </div>
      </>
    );
  }

  // ── Not found ──
  if (!booking) {
    return (
      <>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');`}</style>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-white gap-5"
          style={{ fontFamily:"'DM Sans',sans-serif" }}>
          <div className="text-6xl">🔍</div>
          <h2 className="text-2xl font-bold text-indigo-900" style={{ fontFamily:"'Playfair Display',serif" }}>
            Booking Not Found
          </h2>
          <p className="text-slate-400 text-sm">We couldn't locate this booking.</p>
          <button onClick={() => navigate("/packages")}
            className="mt-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm shadow-lg hover:-translate-y-0.5 transition-all">
            Browse Packages
          </button>
        </div>
      </>
    );
  }

  const title       = booking.title || booking.name || "Travel Booking";
  const isPaid      = booking.paymentStatus === "paid";
  const isCOD       = booking.paymentStatus === "cod";
  const totalPeople = (booking.adults || 0) + (booking.children || 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .suc * { font-family:'DM Sans',sans-serif; }
        .suc-serif { font-family:'Playfair Display',serif; }

        @keyframes fadeUp {
          from{opacity:0;transform:translateY(28px);}
          to{opacity:1;transform:translateY(0);}
        }
        @keyframes popIn {
          0%{opacity:0;transform:scale(0.5);}
          70%{transform:scale(1.15);}
          100%{opacity:1;transform:scale(1);}
        }
        @keyframes checkDraw {
          from{stroke-dashoffset:60;}
          to{stroke-dashoffset:0;}
        }
        @keyframes circleDraw {
          from{stroke-dashoffset:283;}
          to{stroke-dashoffset:0;}
        }
        @keyframes blobDrift {
          0%,100%{transform:translate(0,0) scale(1);border-radius:60% 40% 55% 45%/50% 60% 40% 50%;}
          40%{transform:translate(20px,-18px) scale(1.06);}
          70%{transform:translate(-12px,12px) scale(0.96);}
        }
        @keyframes shimmer {
          0%{background-position:-200% center;}
          100%{background-position:200% center;}
        }
        @keyframes confettiFall {
          0%{transform:translateY(-20px) rotate(0deg);opacity:1;}
          100%{transform:translateY(120px) rotate(720deg);opacity:0;}
        }
        @keyframes rowIn {
          from{opacity:0;transform:translateX(-10px);}
          to{opacity:1;transform:translateX(0);}
        }
        @keyframes badgePop {
          0%{transform:scale(0);opacity:0;}
          60%{transform:scale(1.1);}
          100%{transform:scale(1);opacity:1;}
        }
        @keyframes ticketSlide {
          from{opacity:0;transform:translateY(20px);}
          to{opacity:1;transform:translateY(0);}
        }

        .page-enter{animation:fadeUp 0.65s cubic-bezier(0.22,1,0.36,1) both;}
        .check-icon{animation:popIn 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.1s both;}
        .check-circle{stroke-dasharray:283;animation:circleDraw 0.7s ease 0.2s both;}
        .check-path{stroke-dasharray:60;animation:checkDraw 0.5s ease 0.7s both;}
        .badge-pop{animation:badgePop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.5s both;}
        .ticket-in{animation:ticketSlide 0.6s cubic-bezier(0.22,1,0.36,1) 0.35s both;}

        .row-in{animation:rowIn 0.4s cubic-bezier(0.22,1,0.36,1) both;}
        .row-in:nth-child(1){animation-delay:0.5s}
        .row-in:nth-child(2){animation-delay:0.57s}
        .row-in:nth-child(3){animation-delay:0.64s}
        .row-in:nth-child(4){animation-delay:0.71s}
        .row-in:nth-child(5){animation-delay:0.78s}
        .row-in:nth-child(6){animation-delay:0.85s}

        .blob1{animation:blobDrift 10s ease-in-out infinite;}
        .blob2{animation:blobDrift 13s ease-in-out infinite reverse;}

        /* Confetti pieces */
        .confetti-wrap{position:absolute;inset:0;pointer-events:none;overflow:hidden;}
        .c-piece{
          position:absolute;top:-10px;
          width:8px;height:8px;border-radius:2px;
          animation:confettiFall linear both;
        }

        /* Ticket card */
        .ticket {
          position:relative;
          background:rgba(255,255,255,0.82);
          backdrop-filter:blur(24px);
          -webkit-backdrop-filter:blur(24px);
          border:1px solid rgba(255,255,255,0.85);
          border-radius:28px;
          box-shadow:0 32px 80px rgba(79,70,229,0.18),0 8px 24px rgba(0,0,0,0.06);
        }
        /* Ticket tear line */
        .ticket-tear {
          display:flex;align-items:center;
          position:relative;
          margin:0 -1px;
        }
        .tear-circle {
          width:20px;height:20px;border-radius:50%;
          background:linear-gradient(135deg,#eef2ff,#dbeafe);
          flex-shrink:0;
        }
        .tear-line {
          flex:1;
          border-top:2px dashed rgba(99,102,241,0.2);
          margin:0 4px;
        }

        .detail-row {
          background:rgba(255,255,255,0.5);
          border:1px solid rgba(99,102,241,0.08);
          transition:background 0.2s,border-color 0.2s,transform 0.2s;
        }
        .detail-row:hover {
          background:rgba(255,255,255,0.92);
          border-color:rgba(99,102,241,0.22);
          transform:translateX(4px);
        }

        .action-btn {
          position:relative;overflow:hidden;
          transition:transform 0.2s,box-shadow 0.2s;
        }
        .action-btn.primary {
          background:linear-gradient(135deg,#4338ca 0%,#3b82f6 60%,#6366f1 100%);
          background-size:200% 100%;
          transition:background-position 0.45s,transform 0.2s,box-shadow 0.2s;
        }
        .action-btn.primary:hover {
          background-position:right center;
          transform:translateY(-2px);
          box-shadow:0 14px 36px rgba(79,70,229,0.4);
        }
        .action-btn.primary::after{
          content:'';position:absolute;inset:0;border-radius:inherit;
          background:linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.15) 50%,transparent 65%);
          background-size:200% 100%;
          animation:shimmer 2.6s infinite;
        }
        .action-btn.secondary:hover{
          background:rgba(99,102,241,0.06);
          border-color:rgba(99,102,241,0.3);
          transform:translateY(-1px);
        }

        @media print {
          .no-print { display:none !important; }
          .suc { background:white !important; }
          .ticket { box-shadow:none !important; border:1px solid #e5e7eb !important; }
        }
      `}</style>

      <div className="suc min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-white relative overflow-hidden flex items-center justify-center px-5 py-12">

        {/* Blobs */}
        <div className="blob1 pointer-events-none absolute -top-32 -left-32 w-[480px] h-[480px] bg-indigo-200/22 blur-3xl" />
        <div className="blob2 pointer-events-none absolute -bottom-28 -right-28 w-[420px] h-[420px] bg-blue-200/18 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage:"radial-gradient(circle,#4f46e5 1.2px,transparent 1.2px)", backgroundSize:"30px 30px" }} />

        {/* Confetti */}
        <div className="confetti-wrap no-print">
          {[
            { left:"10%",  delay:"0.2s",  dur:"1.8s", bg:"#818cf8" },
            { left:"20%",  delay:"0.5s",  dur:"2.1s", bg:"#34d399" },
            { left:"32%",  delay:"0.1s",  dur:"1.6s", bg:"#fbbf24" },
            { left:"45%",  delay:"0.7s",  dur:"2.3s", bg:"#f472b6" },
            { left:"58%",  delay:"0.3s",  dur:"1.9s", bg:"#60a5fa" },
            { left:"68%",  delay:"0.9s",  dur:"2.0s", bg:"#a78bfa" },
            { left:"78%",  delay:"0.4s",  dur:"1.7s", bg:"#4ade80" },
            { left:"88%",  delay:"0.6s",  dur:"2.2s", bg:"#fb923c" },
            { left:"15%",  delay:"1.1s",  dur:"2.4s", bg:"#38bdf8" },
            { left:"52%",  delay:"1.3s",  dur:"1.5s", bg:"#f43f5e" },
            { left:"72%",  delay:"1.0s",  dur:"2.1s", bg:"#c084fc" },
            { left:"35%",  delay:"1.5s",  dur:"1.8s", bg:"#facc15" },
          ].map((p, i) => (
            <div key={i} className="c-piece"
              style={{ left:p.left, background:p.bg, animationDelay:p.delay, animationDuration:p.dur,
                borderRadius: i % 3 === 0 ? "50%" : i % 3 === 1 ? "2px" : "0" }} />
          ))}
        </div>

        {/* ── TICKET CARD ── */}
        <div className="ticket w-full max-w-md relative z-10 page-enter overflow-hidden">

          {/* Top accent bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-emerald-400 to-blue-500" />

          {/* ── HEADER ZONE ── */}
          <div className="px-7 pt-8 pb-6 text-center">

            {/* Animated check */}
            <div className="check-icon inline-flex items-center justify-center w-20 h-20 mb-5">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle className="check-circle" cx="40" cy="40" r="36"
                  stroke="url(#cg)" strokeWidth="3.5" fill="rgba(236,253,245,0.8)"
                  strokeLinecap="round" />
                <path className="check-path" d="M25 41l10 10 20-22"
                  stroke="url(#pg)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="cg" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6366f1"/><stop offset="1" stopColor="#10b981"/>
                  </linearGradient>
                  <linearGradient id="pg" x1="25" y1="40" x2="55" y2="40" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4338ca"/><stop offset="1" stopColor="#10b981"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <h1 className="suc-serif text-3xl font-extrabold text-indigo-950 leading-tight mb-1">
              Booking Confirmed!
            </h1>
            <p className="text-slate-400 text-sm font-light">
              Your adventure is all set. Have a wonderful trip! 🌍
            </p>

            {/* Payment status badge */}
            <div className={`badge-pop inline-flex items-center gap-2 mt-4 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider
              ${isPaid ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                       : "bg-amber-50 border border-amber-200 text-amber-700"}`}>
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isPaid ? "bg-emerald-500" : "bg-amber-500"}`} />
              {isPaid ? "✅ Payment Successful" : "💵 Cash on Arrival"}
            </div>
          </div>

          {/* ── BOOKING ID STRIP ── */}
          <div className="ticket-in mx-6 mb-0">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl px-5 py-4 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage:"radial-gradient(circle,white 1px,transparent 1px)", backgroundSize:"14px 14px" }} />
              <div className="relative flex items-center justify-between gap-3">
                <div>
                  <p className="text-indigo-200 text-[10px] font-semibold tracking-widest uppercase mb-0.5">Booking ID</p>
                  <p className="suc-serif text-xl font-extrabold text-white tracking-wide leading-tight">
                    {booking.bookingId}
                  </p>
                </div>
                <button
                  onClick={copyId}
                  className="no-print flex items-center gap-1.5 bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all active:scale-95"
                >
                  {copied ? (
                    <><svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>Copied!</>
                  ) : (
                    <><svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" stroke="white" strokeWidth="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="white" strokeWidth="2"/></svg>Copy</>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Tear line */}
          <div className="ticket-tear mx-3 my-5">
            <div className="tear-circle" />
            <div className="tear-line" />
            <div className="tear-circle" />
          </div>

          {/* ── DETAIL ROWS ── */}
          <div className="px-6 pb-6">
            <p className="text-[10px] font-bold tracking-[0.16em] text-indigo-400 uppercase mb-3">
              Trip Details
            </p>
            <div className="space-y-2 mb-6">
              {[
                { icon:"🏖️", label:"Package",  value:title },
                { icon:"👤", label:"Name",      value:booking.name },
                { icon:"📧", label:"Email",     value:booking.email },
                { icon:"👥", label:"Guests",    value:`${totalPeople} person${totalPeople !== 1 ? "s" : ""} (${booking.adults} adult${booking.adults !== 1 ? "s" : ""}${booking.children > 0 ? ` · ${booking.children} child${booking.children !== 1 ? "ren" : ""}` : ""})` },
                { icon:"📅", label:"Dates",     value:`${formatDate(booking.checkIn)} → ${formatDate(booking.checkOut)}` },
                { icon:"🌙", label:"Nights",    value:`${booking.days} night${booking.days !== 1 ? "s" : ""}` },
              ].map(({ icon, label, value }) => (
                <div key={label} className="row-in detail-row flex items-center justify-between rounded-2xl px-4 py-2.5 gap-3">
                  <span className="flex items-center gap-2 text-xs text-slate-500 font-medium flex-shrink-0">
                    <span>{icon}</span>{label}
                  </span>
                  <span className="text-xs font-semibold text-indigo-900 text-right truncate max-w-[55%]">{value}</span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex items-center justify-between bg-indigo-50 border border-indigo-200 rounded-2xl px-5 py-4 mb-6">
              <div>
                <p className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase mb-0.5">Amount Paid</p>
                <p className="text-xs text-slate-400">{isCOD ? "Payable on arrival" : "Transaction complete"}</p>
              </div>
              <p className="suc-serif text-3xl font-extrabold text-indigo-600 leading-none">
                ₹{formatPrice(booking.totalPrice)}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 no-print">
              <button
                onClick={() => navigate("/")}
                className="action-btn primary flex-1 flex items-center justify-center gap-2 text-white font-bold text-sm py-3.5 rounded-2xl"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="relative z-10">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="7" y1="7" x2="7.01" y2="7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span className="relative z-10">Book Again</span>
              </button>

              <button
                onClick={() => window.print()}
                className="action-btn secondary flex-1 flex items-center justify-center gap-2 text-indigo-600 font-semibold text-sm py-3.5 rounded-2xl border border-indigo-200 bg-white/70 backdrop-blur transition-all"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Print Ticket
              </button>
            </div>

            {/* Footer note */}
            <p className="text-center text-[10px] text-slate-400 mt-4 font-medium">
              A confirmation has been sent to <span className="text-indigo-500 font-semibold">{booking.email}</span>
            </p>

          </div>
        </div>
      </div>
    </>
  );
}