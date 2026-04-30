import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

// ── Reusable Field wrapper ──
const Field = ({ label, icon, error, children }) => (
  <div>
    <label className="block text-[10px] font-bold tracking-[0.16em] text-indigo-400 uppercase mb-1.5 pl-0.5">
      {icon && <span className="mr-1">{icon}</span>}
      {label}
    </label>
    {children}
    {error && (
      <p className="text-rose-500 text-xs mt-1 pl-0.5 font-medium flex items-center gap-1">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        {error}
      </p>
    )}
  </div>
);

// ── Counter input ──
const Counter = ({ value, min, onChange }) => (
  <div className="flex items-center gap-3 bg-white/70 border border-indigo-100 rounded-2xl px-4 py-2.5 focus-within:border-indigo-400 focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] transition-all">
    <button
      type="button"
      onClick={() => onChange(Math.max(min, value - 1))}
      className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold text-base flex items-center justify-center hover:bg-indigo-100 active:scale-95 transition-all select-none"
    >−</button>
    <span className="flex-1 text-center text-sm font-bold text-indigo-950">{value}</span>
    <button
      type="button"
      onClick={() => onChange(value + 1)}
      className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold text-base flex items-center justify-center hover:bg-indigo-100 active:scale-95 transition-all select-none"
    >+</button>
  </div>
);

export default function Booking() {
  const { state }  = useLocation();
  const navigate   = useNavigate();
  const pkg        = state?.pkg;

 const [form, setForm] = useState({
  name: "",
  email: "",
  phone: "",
  adults: 1,
  children: 0,
  checkin: "",
  checkout: "",
});
  const [errors,     setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);

  // ── Not found ──
  if (!pkg) {
    return (
      <>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');`}</style>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-white gap-5">
          <div className="text-6xl">🧳</div>
          <h2 className="text-2xl font-bold text-indigo-900" style={{ fontFamily:"'Playfair Display',serif" }}>
            No Package Selected
          </h2>
          <p className="text-slate-400 text-sm">Please choose a package or destination first.</p>
          <button
            onClick={() => navigate("/packages")}
            className="mt-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm shadow-lg hover:-translate-y-0.5 hover:shadow-indigo-300 transition-all"
          >
            Browse Packages
          </button>
        </div>
      </>
    );
  }

  const title    = pkg.title || pkg.name || "Travel Package";
  const duration = pkg.duration || "Flexible Plan";
  const price    = pkg.price || 0;
  const today    = new Date().toISOString().split("T")[0];

  const totalPeople = form.adults + form.children;
  const getDays     = () => {
    if (!form.checkin || !form.checkout) return 0;
    const d = (new Date(form.checkout) - new Date(form.checkin)) / 86400000;
    return d > 0 ? d : 0;
  };
  
  const days       = getDays();
  const totalPrice = totalPeople * price * days;
  const formatPrice = (p) => Number(p).toLocaleString("en-IN");

  const generateBookingId = () => {
    const date   = new Date().toISOString().slice(0,10).replace(/-/g,"");
    const random = Math.floor(1000 + Math.random() * 9000);
    return `BK-${date}-${random}`;
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name    = "Full name is required";
    if (!form.email.trim()) e.email   = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.checkin)      e.checkin  = "Check-in date required";
    if (!form.checkout)     e.checkout = "Check-out date required";
   if (!form.phone.trim()) {
  e.phone = "Phone number is required";
} else if (!/^[6-9]\d{9}$/.test(form.phone)) {
  e.phone = "Enter valid 10-digit Indian mobile number";
}
    if (form.checkin && form.checkout && days <= 0) e.checkout = "Must be after check-in";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    setTimeout(() => {
      navigate("/payment", {
        state: { bookingId: generateBookingId(), pkg, form, totalPrice, days },
      });
    }, 600);
  };

  const inputCls = (err) =>
    `w-full bg-white/70 border ${err ? "border-rose-400 focus:border-rose-400 focus:shadow-[0_0_0_3px_rgba(244,63,94,0.12)]" : "border-indigo-100 focus:border-indigo-400 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]"} rounded-2xl px-4 py-3 text-sm text-slate-700 font-medium outline-none transition-all placeholder-slate-300`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .bk * { font-family:'DM Sans',sans-serif; }
        .bk-serif { font-family:'Playfair Display',serif; }

        @keyframes fadeUp {
          from{opacity:0;transform:translateY(22px);}
          to{opacity:1;transform:translateY(0);}
        }
        @keyframes slideRight {
          from{opacity:0;transform:translateX(20px);}
          to{opacity:1;transform:translateX(0);}
        }
        @keyframes fieldIn {
          from{opacity:0;transform:translateY(10px);}
          to{opacity:1;transform:translateY(0);}
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

        .page-enter{animation:fadeUp 0.65s cubic-bezier(0.22,1,0.36,1) both;}
        .summary-enter{animation:slideRight 0.65s cubic-bezier(0.22,1,0.36,1) both;animation-delay:0.1s;}
        .f1{animation:fieldIn 0.45s cubic-bezier(0.22,1,0.36,1) both;animation-delay:0.08s;}
        .f2{animation:fieldIn 0.45s cubic-bezier(0.22,1,0.36,1) both;animation-delay:0.14s;}
        .f3{animation:fieldIn 0.45s cubic-bezier(0.22,1,0.36,1) both;animation-delay:0.20s;}
        .f4{animation:fieldIn 0.45s cubic-bezier(0.22,1,0.36,1) both;animation-delay:0.26s;}
        .f5{animation:fieldIn 0.45s cubic-bezier(0.22,1,0.36,1) both;animation-delay:0.32s;}

        .blob1{animation:blobDrift 10s ease-in-out infinite;}
        .blob2{animation:blobDrift 13s ease-in-out infinite reverse;}

        .submit-btn{
          background:linear-gradient(135deg,#4338ca 0%,#3b82f6 60%,#6366f1 100%);
          background-size:200% 100%;
          position:relative;overflow:hidden;
          transition:background-position 0.45s,transform 0.2s,box-shadow 0.2s;
        }
        .submit-btn:hover:not(:disabled){
          background-position:right center;
          transform:translateY(-2px);
          box-shadow:0 16px 44px rgba(79,70,229,0.42);
        }
        .submit-btn::after{
          content:'';position:absolute;inset:0;border-radius:inherit;
          background:linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.15) 50%,transparent 65%);
          background-size:200% 100%;
          animation:shimmer 2.6s infinite;
        }
        .spinner{width:18px;height:18px;border:2px solid rgba(255,255,255,0.35);border-top-color:white;border-radius:50%;animation:spin 0.7s linear infinite;}

        .s-row{background:rgba(255,255,255,0.55);border:1px solid rgba(99,102,241,0.1);transition:background 0.2s,border-color 0.2s,transform 0.2s;}
        .s-row:hover{background:rgba(255,255,255,0.9);border-color:rgba(99,102,241,0.25);transform:translateX(4px);}

        input[type="date"]::-webkit-calendar-picker-indicator{filter:invert(35%) sepia(60%) saturate(500%) hue-rotate(210deg);cursor:pointer;}
      `}</style>

      <div className="bk min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-white relative overflow-hidden">

        {/* Blobs */}
        <div className="blob1 pointer-events-none absolute -top-32 -left-32 w-[480px] h-[480px] bg-indigo-200/25 blur-3xl" />
        <div className="blob2 pointer-events-none absolute -bottom-28 -right-28 w-[400px] h-[400px] bg-blue-200/20 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage:"radial-gradient(circle,#4f46e5 1.2px,transparent 1.2px)", backgroundSize:"30px 30px" }} />

        <div className="relative z-10 max-w-6xl mx-auto px-5 py-12">

          {/* ── PAGE HEADER ── */}
          <div className="page-enter text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur border border-indigo-100 rounded-full px-4 py-1.5 text-xs font-semibold text-indigo-500 tracking-widest uppercase mb-4 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse inline-block" />
              Step 1 of 2 — Booking Details
            </div>
            <h1 className="bk-serif text-4xl md:text-5xl font-extrabold text-indigo-950 leading-tight">
              Book Your Trip
            </h1>
            <p className="text-slate-400 mt-2 text-base font-light">Fill in the details below to proceed to payment.</p>
          </div>

          {/* ── TWO-COLUMN ── */}
          <div className="grid lg:grid-cols-5 gap-8 items-start">

            {/* ════ FORM ════ */}
            <div className="lg:col-span-3 page-enter">
              <div className="bg-white/75 backdrop-blur-xl border border-white/80 rounded-3xl shadow-xl shadow-indigo-100/50 overflow-hidden">
                <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-blue-400 to-indigo-500" />

                <form onSubmit={handleSubmit} className="px-7 py-8 space-y-6">

                  {/* Section: Traveller */}
                  <div>
                  
                    <div className="space-y-3">
                      <div className="f1">
                        <Field label="Full Name" icon="👤" error={errors.name}>
                          <input
                            type="text"
                            placeholder="e.g. Debasish Panda"
                            value={form.name}
                            onChange={(e) => { setForm(p => ({...p, name:e.target.value})); setErrors(p => ({...p, name:""})); }}
                            className={inputCls(errors.name)}
                          />
                        </Field>
                      </div>
                      <div className="f2">
                        <Field label="Email Address" icon="📧" error={errors.email}>
                          <input
                            type="email"
                            placeholder="e.g. djproject963@gmail.com"
                            value={form.email}
                            onChange={(e) => { setForm(p => ({...p, email:e.target.value})); setErrors(p => ({...p, email:""})); }}
                            className={inputCls(errors.email)}
                          />
                        </Field>
                      </div>
                     <div className="f3">
  <Field label="Phone Number" icon="📞" error={errors.phone}>
    
    <div className={`flex items-center border rounded-2xl overflow-hidden ${errors.phone ? "border-red-400" : "border-gray-200"}  `}>

      {/* +91 PREFIX */}
      <span className="px-3 text-sm text-gray-600 bg-gray-100 border-r">
        +91
      </span>

      {/* INPUT */}
      <input
        type="tel"
        placeholder="9876543210"
        value={form.phone}
        maxLength={10}
        onChange={(e) => {
          let value = e.target.value.replace(/\D/g, "");

          // Prevent invalid starting digit
          if (value.length === 1 && !/[6-9]/.test(value)) return;

          setForm((prev) => ({ ...prev, phone: value }));
          setErrors((prev) => ({ ...prev, phone: "" }));
        }}
        className="flex-1 px-3 py-3 outline-none text-sm bg-transparent"
      />
    </div>

  </Field>
</div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />

                  {/* Section: Guests */}
                  <div className="f3">
                    <p className="text-[10px] font-bold tracking-[0.18em] text-indigo-400 uppercase mb-4">
                      👥 Guests
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Adults" icon="🧑">
                        <Counter
                          value={form.adults}
                          min={1}
                          onChange={(v) => setForm(p => ({...p, adults:v}))}
                        />
                      </Field>
                      <Field label="Children" icon="👧">
                        <Counter
                          value={form.children}
                          min={0}
                          onChange={(v) => setForm(p => ({...p, children:v}))}
                        />
                      </Field>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />

                  {/* Section: Dates */}
                  <div className="f4">
                    <p className="text-[10px] font-bold tracking-[0.18em] text-indigo-400 uppercase mb-4">
                      📅 Travel Dates
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Check-in" icon="📅" error={errors.checkin}>
                        <input
                          type="date"
                          min={today}
                          value={form.checkin}
                          onChange={(e) => { setForm(p => ({...p, checkin:e.target.value, checkout:""})); setErrors(p => ({...p, checkin:""})); }}
                          className={inputCls(errors.checkin)}
                        />
                      </Field>
                      <Field label="Check-out" icon="📅" error={errors.checkout}>
                        <input
                          type="date"
                          min={form.checkin || today}
                          value={form.checkout}
                          onChange={(e) => { setForm(p => ({...p, checkout:e.target.value})); setErrors(p => ({...p, checkout:""})); }}
                          className={inputCls(errors.checkout)}
                        />
                      </Field>
                    </div>
                    {days > 0 && (
                      <div className="mt-3 inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                        🌙 {days} night{days > 1 ? "s" : ""} selected
                      </div>
                    )}
                  </div>

                  {/* Submit */}
                  <div className="f5">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="submit-btn w-full flex items-center justify-center gap-3 text-white font-bold text-base py-4 rounded-2xl disabled:opacity-80 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <span className="relative z-10 flex items-center gap-2">
                          <div className="spinner" />
                          Processing…
                        </span>
                      ) : (
                        <span className="relative z-10 flex items-center gap-2">
                          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                            <path d="M9 12l2 2 4-4M12 3C7 3 4 7 4 12s3 9 8 9 8-4 8-9-3-9-8-9z"
                              stroke="white" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                          Continue to Payment
                        </span>
                      )}
                    </button>
                  </div>

                </form>
              </div>
            </div>

            {/* ════ SUMMARY SIDEBAR ════ */}
            <div className="lg:col-span-2 summary-enter">
              <div className="sticky top-24 space-y-4">

                {/* Package card */}
                <div className="bg-white/75 backdrop-blur-xl border border-white/80 rounded-3xl shadow-xl shadow-indigo-100/50 overflow-hidden">
                  <div className="h-1.5 w-full bg-gradient-to-r from-blue-400 via-indigo-500 to-blue-400" />
                  <div className="px-6 py-6">
                    <p className="text-[10px] font-bold tracking-[0.18em] text-indigo-400 uppercase mb-4">
                      Order Summary
                    </p>

                    {/* Package identity */}
                    <div className="flex items-start gap-3 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-200">
                        <span className="text-lg">🏖️</span>
                      </div>
                      <div>
                        <h3 className="bk-serif text-lg font-bold text-indigo-950 leading-tight">{title}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">⏱ {duration}</p>
                      </div>
                    </div>

                    {/* Detail rows */}
                    <div className="space-y-2 mb-5">
                      {[
                        { icon:"👥", label:"Guests",   value:`${totalPeople} person${totalPeople > 1 ? "s" : ""}` },
                        { icon:"🌙", label:"Nights",   value:days > 0 ? `${days} night${days > 1 ? "s" : ""}` : "—" },
                        { icon:"💰", label:"Rate",     value:`₹${formatPrice(price)} / person / night` },
                      ].map(({ icon, label, value }) => (
                        <div key={label} className="s-row flex items-center justify-between rounded-xl px-3.5 py-2.5">
                          <span className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                            <span>{icon}</span>{label}
                          </span>
                          <span className="text-xs font-semibold text-indigo-900">{value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent mb-5" />

                    {/* Total */}
                    <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl px-5 py-4 relative overflow-hidden">
                      <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage:"radial-gradient(circle,white 1px,transparent 1px)", backgroundSize:"16px 16px" }} />
                      <div className="relative flex items-center justify-between">
                        <div>
                          <p className="text-indigo-200 text-[10px] font-semibold tracking-widest uppercase mb-0.5">Total</p>
                          <p className="text-white/60 text-xs">Incl. all taxes</p>
                        </div>
                        <p className="bk-serif text-3xl font-extrabold text-white leading-none tracking-tight">
                          {totalPrice > 0 ? `₹${formatPrice(totalPrice)}` : "—"}
                        </p>
                      </div>
                    </div>

                    {/* Calculation hint */}
                    {totalPrice > 0 && (
                      <p className="text-center text-[10px] text-slate-400 mt-3 font-medium">
                        {totalPeople} person{totalPeople > 1 ? "s" : ""} × ₹{formatPrice(price)} × {days} night{days > 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                </div>

                {/* Trust row */}
                <div className="bg-white/60 backdrop-blur border border-white/70 rounded-2xl px-5 py-4 grid grid-cols-3 gap-3">
                  {[
                    { icon:"🔒", label:"Secure" },
                    { icon:"✅", label:"Verified" },
                    { icon:"⚡", label:"Instant" },
                  ].map(({ icon, label }) => (
                    <div key={label} className="flex flex-col items-center gap-1">
                      <span className="text-xl">{icon}</span>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{label}</span>
                    </div>
                  ))}
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}