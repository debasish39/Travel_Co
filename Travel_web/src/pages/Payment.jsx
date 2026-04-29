import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [isPaying, setIsPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [method, setMethod] = useState("online");

  // ── Guards ──
  if (!state || !state.bookingId) {
    return (
      <>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');`}</style>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-white gap-4">
          <div className="text-6xl">⚠️</div>
          <h2 className="text-2xl font-bold text-indigo-900" style={{ fontFamily: "'Playfair Display',serif" }}>No Booking Found</h2>
          <p className="text-slate-400 text-sm">Please complete your booking first.</p>
          <button onClick={() => navigate("/packages")}
            className="mt-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm shadow-lg hover:-translate-y-0.5 transition-all">
            Browse Packages
          </button>
        </div>
      </>
    );
  }

  const { bookingId, pkg, form, totalPrice, days } = state;
  const title = pkg?.title || pkg?.name || "Travel Booking";
  const totalPeople = (form?.adults || 0) + (form?.children || 0);
  const formatPrice = (p) => Number(p).toLocaleString("en-IN");
  const isOnline = method === "online";
  const isCOD = method === "cod";

  const handlePayment = async () => {
    try {
      if (!totalPrice || totalPrice <= 0) return alert("Invalid amount");
      setIsPaying(true);

      if (isCOD) {
        const res = await fetch("http://localhost:5000/api/bookings", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingId,
            title,
            price: pkg.price,

            name: form.name,
            email: form.email,
            phone: form.phone, // ✅ ADD THIS

            adults: form.adults,
            children: form.children,

            checkIn: form.checkin,
            checkOut: form.checkout,

            totalPrice,
            days,

            paymentStatus: "cod",
            paymentMode: "cod",
          }),
        });
        const data = await res.json();
        if (!data.success) { alert("Booking failed ❌"); setIsPaying(false); return; }
        setPaid(true);
        setTimeout(() => navigate(`/success/${bookingId}`), 300);
        return;
      }

      const orderRes = await fetch("http://localhost:5000/api/payment/create-order", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalPrice }),
      });
      const orderData = await orderRes.json();
      if (!orderData.success) { alert("Failed to create order ❌"); setIsPaying(false); return; }

      const rzp = new window.Razorpay({
        key: orderData.key, amount: orderData.order.amount, currency: "INR",
        name: "TravelCo", description: title, order_id: orderData.order.id,
        prefill: { name: form.name, email: form.email },
        theme: { color: "#4f46e5" },
        handler: async (response) => {
          try {
            const vRes = await fetch("http://localhost:5000/api/payment/verify-payment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(response) });
            const vData = await vRes.json();
            if (!vData.success) { alert("Verification failed ❌"); setIsPaying(false); return; }
            const sRes = await fetch("http://localhost:5000/api/bookings", {
              method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
                bookingId,
                title,
                price: pkg.price,

                name: form.name,
                email: form.email,
                phone: form.phone, // ✅ ADD THIS

                adults: form.adults,
                children: form.children,

                checkIn: form.checkin,
                checkOut: form.checkout,

                totalPrice,
                days,

                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,

                paymentStatus: "paid",
                paymentMode: "online",
              })
            });
            const sData = await sRes.json();
            if (!sData.success) { alert("Booking save failed ❌"); setIsPaying(false); return; }
            setPaid(true);
            setTimeout(() => navigate(`/success/${bookingId}`), 800);
          } catch (e) { console.error(e); alert("Error ❌"); setIsPaying(false); }
        },
      });
      rzp.on("payment.failed", (r) => { console.error(r); alert("Payment failed ❌"); setIsPaying(false); });
      rzp.open();
    } catch (e) { console.error(e); alert("Payment error ❌"); setIsPaying(false); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .pay-page * { font-family:'DM Sans',sans-serif; }
        .pay-serif  { font-family:'Playfair Display',serif; }

        @keyframes fadeUp {
          from{opacity:0;transform:translateY(22px);}
          to{opacity:1;transform:translateY(0);}
        }
        @keyframes slideIn {
          from{opacity:0;transform:translateX(-12px);}
          to{opacity:1;transform:translateX(0);}
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
        @keyframes spin{to{transform:rotate(360deg);}}
        @keyframes checkPop {
          0%{transform:scale(0);opacity:0;}
          60%{transform:scale(1.25);}
          100%{transform:scale(1);opacity:1;}
        }
        @keyframes infoSlide {
          from{opacity:0;transform:translateY(6px);}
          to{opacity:1;transform:translateY(0);}
        }

        .page-enter{animation:fadeUp 0.65s cubic-bezier(0.22,1,0.36,1) both;}
        .row-enter {animation:slideIn 0.45s cubic-bezier(0.22,1,0.36,1) both;}
        .row-enter:nth-child(1){animation-delay:0.06s}
        .row-enter:nth-child(2){animation-delay:0.12s}
        .row-enter:nth-child(3){animation-delay:0.18s}
        .row-enter:nth-child(4){animation-delay:0.24s}
        .row-enter:nth-child(5){animation-delay:0.30s}
        .blob1{animation:blobDrift 10s ease-in-out infinite;}
        .blob2{animation:blobDrift 13s ease-in-out infinite reverse;}

        .method-track{
          background:rgba(99,102,241,0.07);
          border:1px solid rgba(99,102,241,0.12);
          border-radius:20px; padding:5px;
          display:grid; grid-template-columns:1fr 1fr; gap:4px;
        }
        .method-btn{
          display:flex;align-items:center;justify-content:center;gap:8px;
          padding:11px 12px; border-radius:15px;
          font-size:13px;font-weight:600;
          cursor:pointer; border:none; outline:none;
          transition:all 0.25s cubic-bezier(0.34,1.2,0.64,1);
        }
        .m-online.active{
          background:linear-gradient(135deg,#4338ca,#3b82f6);
          color:white; box-shadow:0 6px 20px rgba(79,70,229,0.38); transform:translateY(-1px);
        }
        .m-online:not(.active){background:transparent;color:#94a3b8;}
        .m-online:not(.active):hover{background:rgba(99,102,241,0.08);color:#4f46e5;}
        .m-cod.active{
          background:linear-gradient(135deg,#059669,#10b981);
          color:white; box-shadow:0 6px 20px rgba(16,185,129,0.38); transform:translateY(-1px);
        }
        .m-cod:not(.active){background:transparent;color:#94a3b8;}
        .m-cod:not(.active):hover{background:rgba(16,185,129,0.08);color:#059669;}

        .info-strip{animation:infoSlide 0.3s ease both;}

        .pay-btn{position:relative;overflow:hidden;transition:background-position 0.45s,transform 0.2s,box-shadow 0.2s;}
        .pay-btn.o-btn{background:linear-gradient(135deg,#4338ca 0%,#3b82f6 60%,#6366f1 100%);background-size:200% 100%;}
        .pay-btn.c-btn{background:linear-gradient(135deg,#059669 0%,#10b981 60%,#34d399 100%);background-size:200% 100%;}
        .pay-btn:hover:not(:disabled){background-position:right center;transform:translateY(-2px);}
        .pay-btn.o-btn:hover:not(:disabled){box-shadow:0 16px 44px rgba(79,70,229,0.42);}
        .pay-btn.c-btn:hover:not(:disabled){box-shadow:0 16px 44px rgba(16,185,129,0.42);}
        .pay-btn::after{content:'';position:absolute;inset:0;border-radius:inherit;background:linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.15) 50%,transparent 65%);background-size:200% 100%;animation:shimmer 2.6s infinite;}

        .spinner{width:19px;height:19px;border:2.5px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin 0.7s linear infinite;}
        .check-pop{animation:checkPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both;}

        .s-row{background:rgba(255,255,255,0.55);border:1px solid rgba(99,102,241,0.1);transition:background 0.2s,border-color 0.2s,transform 0.2s;}
        .s-row:hover{background:rgba(255,255,255,0.92);border-color:rgba(99,102,241,0.25);transform:translateX(4px);}
      `}</style>

      <div className="pay-page min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-white relative overflow-hidden flex items-center justify-center p-6">
        <div className="blob1 pointer-events-none absolute -top-32 -left-32 w-[480px] h-[480px] bg-indigo-200/25 blur-3xl" />
        <div className="blob2 pointer-events-none absolute -bottom-28 -right-28 w-[420px] h-[420px] bg-blue-200/20 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: "radial-gradient(circle,#4f46e5 1.2px,transparent 1.2px)", backgroundSize: "30px 30px" }} />

        <div className="page-enter relative z-10 w-full max-w-md bg-white/78 backdrop-blur-xl border border-white/80 rounded-3xl shadow-2xl shadow-indigo-200/50 overflow-hidden">

          {/* Top bar */}
          <div className={`h-1.5 w-full bg-gradient-to-r transition-all duration-500 ${isCOD ? "from-emerald-400 via-teal-400 to-emerald-400" : "from-indigo-500 via-blue-400 to-indigo-500"}`} />

          <div className="px-7 py-8 space-y-6">

            {/* Header */}
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md transition-all duration-300 ${isCOD ? "bg-gradient-to-br from-emerald-500 to-teal-500 shadow-emerald-200" : "bg-gradient-to-br from-indigo-500 to-blue-500 shadow-indigo-200"}`}>
                {isCOD ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="2" y="6" width="20" height="13" rx="2" stroke="white" strokeWidth="1.8" /><path d="M2 10h20M7 15h2M12 15h5" stroke="white" strokeWidth="1.8" strokeLinecap="round" /></svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="3" stroke="white" strokeWidth="1.8" /><path d="M2 10h20" stroke="white" strokeWidth="1.8" /><rect x="5" y="13" width="4" height="2" rx="1" fill="white" /></svg>
                )}
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-[0.16em] text-indigo-400 uppercase mb-0.5">Secure Checkout</p>
                <h1 className="pay-serif text-2xl font-extrabold text-indigo-950 leading-tight">Complete Payment</h1>
              </div>
            </div>

            {/* Summary rows */}
            <div>
              <p className="text-[10px] font-bold tracking-[0.16em] text-indigo-400 uppercase mb-3">Booking Summary</p>
              <div className="space-y-2">
                {[
                  { icon: "🎫", label: "Booking ID", value: bookingId },
                  { icon: "🏖️", label: "Package", value: title },
                  { icon: "👥", label: "Guests", value: `${totalPeople} person${totalPeople !== 1 ? "s" : ""}` },
                  { icon: "🌙", label: "Nights", value: `${days} night${days !== 1 ? "s" : ""}` },
                  { icon: "📅", label: "Check-in", value: form?.checkin || "—" },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="row-enter s-row flex items-center justify-between rounded-2xl px-4 py-2.5">
                    <span className="flex items-center gap-2 text-xs text-slate-500 font-medium"><span>{icon}</span>{label}</span>
                    <span className="text-xs font-semibold text-indigo-900 max-w-[52%] text-right truncate">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className={`rounded-2xl px-5 py-4 relative overflow-hidden transition-all duration-500 ${isCOD ? "bg-gradient-to-r from-emerald-600 to-teal-500" : "bg-gradient-to-r from-indigo-600 to-blue-500"}`}>
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle,white 1px,transparent 1px)", backgroundSize: "16px 16px" }} />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className={`text-[10px] font-semibold tracking-widest uppercase mb-1 ${isCOD ? "text-emerald-200" : "text-indigo-200"}`}>Total Amount</p>
                  <p className="text-white/60 text-xs">All taxes included</p>
                </div>
                <p className="pay-serif text-3xl font-extrabold text-white leading-none">₹{formatPrice(totalPrice)}</p>
              </div>
            </div>

            {/* Payment method toggle */}
            <div>
              <p className="text-[10px] font-bold tracking-[0.16em] text-indigo-400 uppercase mb-3">Payment Method</p>
              <div className="method-track">
                <button className={`method-btn m-online ${isOnline ? "active" : ""}`} onClick={() => setMethod("online")}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="2" /><path d="M2 10h20" stroke="currentColor" strokeWidth="2" /><rect x="5" y="13" width="4" height="2" rx="1" fill="currentColor" /></svg>
                  Online / UPI
                </button>
                <button className={`method-btn m-cod ${isCOD ? "active" : ""}`} onClick={() => setMethod("cod")}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><rect x="9" y="11" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="2" /><circle cx="15" cy="15.5" r="1.5" fill="currentColor" /></svg>
                  Cash on Arrival
                </button>
              </div>

              {/* Info strip */}
              <div key={method} className={`info-strip mt-3 flex items-start gap-2.5 rounded-xl px-3.5 py-2.5 ${isCOD ? "bg-emerald-50 border border-emerald-200" : "bg-indigo-50 border border-indigo-200"}`}>
                <span className="text-base mt-0.5">{isCOD ? "💵" : "🔐"}</span>
                <p className={`text-xs font-medium leading-relaxed ${isCOD ? "text-emerald-700" : "text-indigo-700"}`}>
                  {isCOD
                    ? "Pay in cash when you arrive. Your booking will be confirmed instantly."
                    : "Powered by Razorpay. Supports UPI, cards, net banking & wallets. 256-bit encrypted."}
                </p>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handlePayment}
              disabled={isPaying || paid}
              className={`pay-btn w-full flex items-center justify-center gap-3 text-white font-bold text-base py-4 rounded-2xl disabled:opacity-80 disabled:cursor-not-allowed ${isCOD ? "c-btn" : "o-btn"}`}
            >
              {paid ? (
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="check-pop" width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="rgba(255,255,255,0.2)" />
                    <path d="M7 12.5l3.5 3.5L17 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Booking Confirmed!
                </span>
              ) : isPaying ? (
                <span className="relative z-10 flex items-center gap-2"><div className="spinner" />Processing…</span>
              ) : isCOD ? (
                <span className="relative z-10 flex items-center gap-2">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4M12 3C7 3 4 7 4 12s3 9 8 9 8-4 8-9-3-9-8-9z" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>
                  Confirm Booking (COD)
                </span>
              ) : (
                <span className="relative z-10 flex items-center gap-2">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="3" stroke="white" strokeWidth="2" /><path d="M2 10h20" stroke="white" strokeWidth="2" /><rect x="5" y="13" width="4" height="2" rx="1" fill="white" /></svg>
                  Pay ₹{formatPrice(totalPrice)}
                </span>
              )}
            </button>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-5 flex-wrap">
              {[
                { icon: <svg width="11" height="13" viewBox="0 0 12 14" fill="none"><path d="M6 1L1 3.5V7c0 2.8 2.2 5.4 5 6 2.8-.6 5-3.2 5-6V3.5L6 1Z" stroke="currentColor" strokeWidth="1.2" /></svg>, label: "SSL Secured" },
                { icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" /><path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>, label: "Instant" },
                { icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4M12 3C7 3 4 7 4 12s3 9 8 9 8-4 8-9-3-9-8-9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>, label: "Verified" },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-slate-400 hover:text-indigo-400 transition-colors cursor-default">
                  {icon}
                  <span className="text-[10px] font-semibold tracking-wide uppercase">{label}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}