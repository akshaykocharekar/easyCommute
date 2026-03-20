import { useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Home() {
  const { token, user } = useContext(AuthContext);

  if (token && user) {
    if (user.role === "SUPER_ADMIN")  return <Navigate to="/admin"     replace />;
    if (user.role === "BUS_OPERATOR") return <Navigate to="/operator"  replace />;
    return                                   <Navigate to="/dashboard" replace />;
  }

  return (
    <div
      className="min-h-screen text-slate-100"
      style={{
        backgroundColor: "#10221c",
        fontFamily: "'Spline Sans', sans-serif",
        backgroundImage: "radial-gradient(circle at 2px 2px, rgba(16,183,127,0.05) 1px, transparent 0)",
        backgroundSize: "24px 24px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Spline+Sans:wght@300;400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap');
        .glass-card {
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.1);
          transition: border-color 0.2s;
        }
        .glass-card:hover { border-color: rgba(16,183,127,0.4); }
        .material-symbols-outlined {
          font-family: 'Material Symbols Outlined';
          font-weight: normal; font-style: normal;
          font-size: 24px; line-height: 1;
          letter-spacing: normal; text-transform: none;
          display: inline-block; white-space: nowrap;
          word-wrap: normal; direction: ltr;
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">

          {/* Left text */}
          <div className="flex-1 text-center lg:text-left">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-widest mb-6"
              style={{ backgroundColor: "rgba(16,183,127,0.1)", borderColor: "rgba(16,183,127,0.2)", color: "#10b77f" }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: "#10b77f" }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: "#10b77f" }} />
              </span>
              Live in Goa
            </div>

            <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight mb-6 tracking-tight">
              Know exactly when your{" "}
              <span style={{ color: "#10b77f" }}>bus arrives</span>
            </h1>

            <p className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
              Real-time GPS tracking for Goa's public transport. Never wait at the stand longer than you need to.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link to="/register" className="w-full sm:w-auto">
                <button
                  className="w-full px-8 py-4 font-bold rounded-xl text-lg transition-all hover:brightness-110"
                  style={{ backgroundColor: "#10b77f", color: "#10221c" }}
                >
                  Get Started Free
                </button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <button className="w-full px-8 py-4 border border-slate-700 text-white font-bold rounded-xl text-lg hover:bg-slate-800 transition-all">
                  Login
                </button>
              </Link>
            </div>
          </div>

          {/* Right phone mockup */}
          <div className="flex-1 relative flex justify-center">
            <div className="relative mx-auto w-[280px] h-[520px] bg-slate-900 rounded-[3rem] border-8 border-slate-800 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-slate-800">
                <div className="absolute inset-0 opacity-30" style={{
                  background: "repeating-linear-gradient(0deg,transparent,transparent 40px,rgba(16,183,127,0.1) 40px,rgba(16,183,127,0.1) 41px),repeating-linear-gradient(90deg,transparent,transparent 40px,rgba(16,183,127,0.1) 40px,rgba(16,183,127,0.1) 41px)"
                }} />
              </div>
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(16,34,28,0.8), transparent)" }} />

              {/* Search bar */}
              <div className="absolute top-10 left-4 right-4 bg-slate-900/90 backdrop-blur rounded-xl p-3 border border-white/10">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined" style={{ color: "#10b77f" }}>search</span>
                  <div className="h-4 w-32 bg-slate-700 rounded" />
                </div>
              </div>

              {/* Bus marker */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="p-2 rounded-full shadow-lg" style={{ backgroundColor: "#10b77f" }}>
                  <span className="material-symbols-outlined text-xl" style={{ color: "#10221c" }}>directions_bus</span>
                </div>
                <div className="mt-2 bg-white px-2 py-1 rounded text-[10px] font-bold text-slate-900 shadow-xl whitespace-nowrap">
                  Kadamba Exp • 2m
                </div>
              </div>

              {/* ETA card */}
              <div className="absolute bottom-6 left-4 right-4 bg-slate-900/95 rounded-2xl p-4 border border-white/10">
                <p className="text-xs text-slate-400 mb-1">Next arrival</p>
                <p className="text-2xl font-black" style={{ color: "#10b77f" }}>2 min</p>
                <p className="text-xs text-slate-400 mt-1">Panaji Bus Stand</p>
              </div>
            </div>

            <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: "rgba(16,183,127,0.1)" }} />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: "rgba(16,183,127,0.05)" }} />
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-12 border-y" style={{ backgroundColor: "rgba(16,183,127,0.05)", borderColor: "rgba(16,183,127,0.1)" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { value: "10",   label: "Active Buses" },
              { value: "10",   label: "Routes Covered" },
              { value: "100+",  label: "Daily Commuters" },
            ].map((s, i) => (
              <div
                key={s.label}
                className={`text-center ${i === 1 ? "border-y md:border-y-0 md:border-x py-8 md:py-0" : ""}`}
                style={i === 1 ? { borderColor: "rgba(16,183,127,0.1)" } : {}}
              >
                <p className="text-4xl font-black text-white mb-1">{s.value}</p>
                <p className="font-medium tracking-wide text-sm uppercase" style={{ color: "#10b77f" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Smart features for smart travelers</h2>
          <p className="text-slate-400">Everything you need to navigate Goa's public transport like a pro.</p>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: "explore",     title: "Live Bus Tracking",  desc: "Pinpoint exact locations of Kadamba and private buses in real-time on our live interactive map." },
            { icon: "location_on", title: "Nearby Buses",       desc: "Instantly find the nearest bus stands and upcoming departures based on your current GPS location." },
            { icon: "route",       title: "Smart Route Search", desc: "Enter your destination and we'll calculate the fastest route, including transfers and total fare estimation." },
          ].map((f) => (
            <div key={f.title} className="glass-card p-8 rounded-2xl group">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: "rgba(16,183,127,0.2)" }}>
                <span className="material-symbols-outlined text-3xl" style={{ color: "#10b77f", fontSize: "30px" }}>{f.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
              <p className="text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-4" style={{ backgroundColor: "rgba(15,23,42,0.4)" }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-20">Track your bus in seconds</h2>
          <div className="relative flex flex-col md:flex-row gap-12 items-start">
            <div className="hidden md:block absolute top-10 left-0 w-full h-0.5 -z-10" style={{ backgroundColor: "rgba(16,183,127,0.2)" }} />
            {[
              { n: "1", title: "Register", desc: "Create a free account to view bus listings, timings, and available routes across Goa." },
              { n: "2", title: "Search",   desc: "Pick your destination and browse real bus schedules and route options instantly." },
              { n: "3", title: "Track",    desc: "Upgrade to Pro and watch your bus live on the map — get ETA right to your stop." },
            ].map((step) => (
              <div key={step.n} className="flex-1 flex flex-col items-center text-center">
                <div
                  className="w-20 h-20 rounded-full text-2xl font-black flex items-center justify-center mb-6 border-4"
                  style={{ backgroundColor: "#10b77f", color: "#10221c", borderColor: "#10221c", boxShadow: "0 20px 40px rgba(16,183,127,0.2)" }}
                >
                  {step.n}
                </div>
                <h4 className="text-xl font-bold text-white mb-2">{step.title}</h4>
                <p className="text-slate-400 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLANS ── */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Simple, honest pricing</h2>
          <p className="text-slate-400">Start free. Unlock everything for a one-time payment.</p>
        </div>

        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Free Plan */}
          <div className="glass-card p-8 rounded-2xl flex flex-col">
            <div className="mb-6">
              <p className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">Free</p>
              <p className="text-5xl font-black text-white">₹0</p>
              <p className="text-slate-500 text-sm mt-1">Forever free</p>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {[
                "View all bus listings",
                "Check bus timings & schedules",
                "Browse all 10 routes",
                "Search by destination",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-slate-300 text-sm">
                  <span className="material-symbols-outlined" style={{ color: "#10b77f", fontSize: "18px" }}>check_circle</span>
                  {item}
                </li>
              ))}
              {[
                "Live bus tracking",
                "Real-time ETA",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-slate-600 text-sm line-through">
                  <span className="material-symbols-outlined" style={{ color: "#475569", fontSize: "18px" }}>cancel</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/register">
              <button className="w-full px-6 py-3 border border-slate-600 text-white font-bold rounded-xl hover:bg-slate-800 transition-all">
                Get Started Free
              </button>
            </Link>
          </div>

          {/* Pro Plan */}
          <div
            className="p-8 rounded-2xl flex flex-col relative overflow-hidden border"
            style={{ background: "linear-gradient(135deg, #0f2d22, #10221c)", borderColor: "rgba(16,183,127,0.4)" }}
          >
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full blur-2xl pointer-events-none" style={{ backgroundColor: "rgba(16,183,127,0.15)" }} />
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: "#10b77f" }}>Pro</p>
                  <p className="text-5xl font-black text-white">₹30</p>
                  <p className="text-slate-400 text-sm mt-1">One-time, lifetime access</p>
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest"
                  style={{ backgroundColor: "rgba(16,183,127,0.2)", color: "#10b77f" }}>
                  Best Value
                </div>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {[
                  "Everything in Free",
                  "Live GPS bus tracking",
                  "Real-time ETA to your stop",
                  "Completely ad-free experience",
                  "Lifetime access — pay once",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-200 text-sm">
                    <span className="material-symbols-outlined" style={{ color: "#10b77f", fontSize: "18px" }}>check_circle</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/plans">
                <button
                  className="w-full px-6 py-3 font-black rounded-xl text-base transition-all hover:brightness-110"
                  style={{ backgroundColor: "#10b77f", color: "#10221c" }}
                >
                  Get Pro — ₹30
                </button>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-900 pt-20 pb-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-3xl" style={{ color: "#10b77f", fontSize: "2rem" }}>directions_bus</span>
                <span className="text-2xl font-bold tracking-tight text-white">EasyCommute</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Making Goa's public transport reliable and accessible for everyone. Tracking 10 buses across 10 routes daily.
              </p>
            </div>

            <div>
              <h5 className="text-white font-bold mb-6">Quick Links</h5>
              <ul className="space-y-4 text-slate-400 text-sm">
                <li><Link to="/search"    className="hover:text-emerald-400 transition-colors">Bus Schedules</Link></li>
                <li><Link to="/nearby"    className="hover:text-emerald-400 transition-colors">Nearby Buses</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="text-white font-bold mb-6">Account</h5>
              <ul className="space-y-4 text-slate-400 text-sm">
                <li><Link to="/login"             className="hover:text-emerald-400 transition-colors">Login</Link></li>
                <li><Link to="/register"          className="hover:text-emerald-400 transition-colors">Register</Link></li>
                <li><Link to="/plans"             className="hover:text-emerald-400 transition-colors">Go Pro — ₹30</Link></li>
                <li><Link to="/register-operator" className="hover:text-emerald-400 transition-colors">Operator Portal</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="text-white font-bold mb-6">Support</h5>
              <ul className="space-y-4 text-slate-400 text-sm">
                <li className="text-slate-500">Help Center</li>
                <li className="text-slate-500">Privacy Policy</li>
                <li className="text-slate-500">Terms of Service</li>
              </ul>
            </div>

          </div>

          <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs">
            <p>© {new Date().getFullYear()} EasyCommute. All rights reserved. Not affiliated with Govt of Goa.</p>
            <span>Designed for Goa</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default Home;