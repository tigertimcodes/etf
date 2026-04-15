import { useState, useEffect } from "react";

const C = {
  bg: "#F7F8FA", white: "#FFFFFF", border: "#EAEDF2",
  text: "#1A1D23", textSub: "#6B7280", textLight: "#9CA3AF",
  purple: "#7B52F4", purpleLight: "#EDE8FF",
  teal: "#00C2B2", tealLight: "#E0FAF8",
  orange: "#FF5C00", orangeLight: "#FFF0E8",
  green: "#10B981", greenLight: "#D1FAE5",
};

const BLOSSOM_LOGO = "data:image/png;base64,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";

function Logo({ src, name }) {
  const [err, setErr] = useState(false);
  if (err) return (
    <div style={{ width:36, height:36, borderRadius:8, background:C.purpleLight, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:14, color:C.purple, flexShrink:0 }}>
      {name?.[0]}
    </div>
  );
  return <img src={src} alt={name} onError={() => setErr(true)} style={{ width:36, height:36, borderRadius:8, objectFit:"contain", background:"#fff", border:`1px solid ${C.border}`, flexShrink:0, padding:2 }} />;
}

function ETFRow({ item, dateLabel, dateValue, isLast }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: isLast ? "none" : `1px solid ${C.border}` }}>
      <div onClick={() => setOpen(!open)}
        style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 20px", cursor:"pointer" }}
        onMouseEnter={e => e.currentTarget.style.background = C.bg}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
        <Logo src={item.logo} name={item.company} />
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontWeight:700, fontSize:"0.88rem", color:C.text, marginBottom:2 }}>{item.company}</div>
          <div style={{ fontSize:"0.78rem", color:C.textSub, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{item.etf}</div>
        </div>
        <div style={{ textAlign:"right", flexShrink:0 }}>
          <div style={{ fontWeight:800, fontSize:"0.82rem", color:C.purple, background:C.purpleLight, padding:"2px 8px", borderRadius:6, marginBottom:3, display:"inline-block" }}>{item.ticker}</div>
          <div style={{ fontSize:"0.72rem", color:C.textLight }}>{dateLabel}: {dateValue}</div>
        </div>
        <div style={{ color:C.textLight, fontSize:12, marginLeft:8 }}>{open ? "▲" : "▼"}</div>
      </div>
      {open && (
        <div style={{ padding:"0 20px 16px 68px", background:C.bg }}>
          <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap" }}>
            {item.linkedin && (
              <a href={item.linkedin} target="_blank" rel="noopener noreferrer"
                style={{ display:"inline-flex", alignItems:"center", gap:4, background:"#0A66C2", color:"#fff", fontSize:"0.73rem", fontWeight:700, padding:"4px 10px", borderRadius:6, textDecoration:"none" }}>
                <span style={{ fontWeight:900 }}>in</span> Company Page
              </a>
            )}
            <a href={`https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(item.company + " ETF marketing")}`} target="_blank" rel="noopener noreferrer"
              style={{ background:C.white, border:`1px solid ${C.border}`, color:C.text, fontSize:"0.73rem", fontWeight:600, padding:"4px 10px", borderRadius:6, textDecoration:"none" }}>
              🔍 Find Team on LinkedIn
            </a>
          </div>
          <div style={{ fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textLight, marginBottom:8 }}>Outreach Contacts</div>
          {item.contacts?.map((c, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:10, background:C.white, border:`1px solid ${C.border}`, borderRadius:8, padding:"8px 12px", marginBottom:6 }}>
              <div style={{ width:28, height:28, borderRadius:"50%", background:C.purpleLight, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:C.purple, flexShrink:0 }}>
                {c.name?.[0]}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:700, fontSize:"0.82rem", color:C.text }}>{c.name}</div>
                <div style={{ fontSize:"0.72rem", color:C.textSub }}>{c.title}</div>
              </div>
              <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                <a href={`https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(c.name + " " + item.company)}`} target="_blank" rel="noopener noreferrer"
                  style={{ background:"#0A66C2", color:"#fff", fontSize:"0.7rem", fontWeight:700, padding:"3px 8px", borderRadius:5, textDecoration:"none" }}>in</a>
                {c.email && (
                  <a href={`mailto:${c.email}`}
                    style={{ background:C.orangeLight, color:C.orange, border:`1px solid ${C.orange}30`, fontSize:"0.7rem", fontWeight:600, padding:"3px 8px", borderRadius:5, textDecoration:"none", maxWidth:170, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    ✉ {c.email}
                  </a>
                )}
              </div>
            </div>
          ))}
          <div style={{ fontSize:"0.68rem", color:C.textLight, marginTop:4, fontStyle:"italic" }}>* Emails are best-guess format — verify before outreach</div>
        </div>
      )}
    </div>
  );
}

function Table({ title, icon, color, colorLight, items, dateLabel, dateKey, loading, emptyMsg }) {
  return (
    <div style={{ background:C.white, borderRadius:12, border:`1px solid ${C.border}`, overflow:"hidden", marginBottom:24 }}>
      <div style={{ padding:"16px 20px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:32, height:32, borderRadius:8, background:colorLight, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>{icon}</div>
        <div>
          <div style={{ fontWeight:800, fontSize:"0.95rem", color:C.text }}>{title}</div>
          <div style={{ fontSize:"0.72rem", color:C.textSub }}>{loading ? "Loading…" : `${items.length} funds · click any row to expand contacts`}</div>
        </div>
        <div style={{ marginLeft:"auto", background:colorLight, color, fontWeight:800, fontSize:"0.78rem", padding:"4px 12px", borderRadius:100 }}>
          {loading ? "…" : `${items.length} leads`}
        </div>
      </div>
      {loading ? (
        <div style={{ padding:32, textAlign:"center" }}>
          <div style={{ fontSize:"1.5rem", animation:"spin 1s linear infinite", display:"inline-block", marginBottom:8 }}>⟳</div>
          <div style={{ color:C.textSub, fontSize:"0.85rem" }}>Fetching from SEC EDGAR…</div>
        </div>
      ) : items.length === 0 ? (
        <div style={{ padding:32, textAlign:"center", color:C.textLight, fontSize:"0.85rem" }}>{emptyMsg}</div>
      ) : (
        items.map((item, i) => (
          <ETFRow key={i} item={item} dateLabel={dateLabel} dateValue={item[dateKey]} isLast={i === items.length - 1} />
        ))
      )}
    </div>
  );
}

export default function App() {
  const [filed, setFiled] = useState([]);
  const [launched, setLaunched] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
  const [activeNav, setActiveNav] = useState("ETF Leads");

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/fetch-etfs");
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setFiled(data.filed || []);
      setLaunched(data.launched || []);
      setLastUpdated(new Date().toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" }));
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }

  const showFiled = activeNav !== "Launched";
  const showLaunched = activeNav !== "Filed (N-1A)";

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:C.bg, fontFamily:"'DM Sans','Helvetica Neue',Arial,sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Sidebar */}
      <div style={{ width:200, background:C.white, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", flexShrink:0, position:"sticky", top:0, height:"100vh" }}>
        <div style={{ padding:"20px 16px 16px", borderBottom:`1px solid ${C.border}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <img src={BLOSSOM_LOGO} alt="Blossom" style={{ height:32, width:32, objectFit:"contain" }} />
            <div>
              <div style={{ fontWeight:800, fontSize:"0.9rem", color:C.text, lineHeight:1 }}>blossom</div>
              <div style={{ fontSize:"0.65rem", color:C.textSub, fontWeight:600, letterSpacing:"0.05em", textTransform:"uppercase" }}>ETF LEADS</div>
            </div>
          </div>
        </div>
        <nav style={{ padding:"12px 8px", flex:1 }}>
          {[
            { section:"LEADS", items:["ETF Leads"] },
            { section:"VIEW", items:["Filed (N-1A)", "Launched"] },
          ].map(group => (
            <div key={group.section} style={{ marginBottom:16 }}>
              <div style={{ fontSize:"0.65rem", fontWeight:700, letterSpacing:"0.1em", color:C.textLight, textTransform:"uppercase", padding:"0 8px", marginBottom:4 }}>{group.section}</div>
              {group.items.map(item => (
                <button key={item} onClick={() => setActiveNav(item)}
                  style={{ display:"flex", alignItems:"center", gap:8, width:"100%", padding:"7px 10px", borderRadius:7, border:"none", cursor:"pointer", fontSize:"0.82rem", fontWeight:activeNav === item ? 700 : 500, background:activeNav === item ? C.purpleLight : "transparent", color:activeNav === item ? C.purple : C.textSub, textAlign:"left" }}>
                  {item === "ETF Leads" && "📋 "}{item === "Filed (N-1A)" && "📄 "}{item === "Launched" && "🚀 "}{item}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div style={{ padding:"12px 8px", borderTop:`1px solid ${C.border}` }}>
          {lastUpdated && <div style={{ fontSize:"0.7rem", color:C.textLight, textAlign:"center", marginBottom:6 }}>Updated {lastUpdated}</div>}
          <button onClick={fetchData} disabled={loading}
            style={{ width:"100%", padding:"7px", background:C.purpleLight, color:C.purple, border:"none", borderRadius:7, fontSize:"0.78rem", fontWeight:700, cursor:loading ? "not-allowed" : "pointer" }}>
            {loading ? "⟳ Loading…" : "🔄 Refresh"}
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ background:C.white, borderBottom:`1px solid ${C.border}`, padding:"12px 24px", display:"flex", alignItems:"center", gap:12, position:"sticky", top:0, zIndex:10 }}>
          <div>
            <div style={{ fontWeight:800, fontSize:"1rem", color:C.text }}>ETF Lead Intelligence</div>
            <div style={{ fontSize:"0.72rem", color:C.textSub }}>🇺🇸 US market · SEC EDGAR · past 30 days</div>
          </div>
        </div>

        <div style={{ padding:24 }}>
          {/* Stat cards */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
            {[
              { label:"N-1A Filings", value: loading ? "…" : filed.length, sub:"Registered with SEC", color:C.purple, bg:C.purpleLight, icon:"📄" },
              { label:"Live Launches", value: loading ? "…" : launched.length, sub:"Trading in market", color:C.teal, bg:C.tealLight, icon:"🚀" },
              { label:"Total Leads", value: loading ? "…" : filed.length + launched.length, sub:"Companies to contact", color:C.orange, bg:C.orangeLight, icon:"🎯" },
              { label:"Data Source", value:"SEC", sub:"EDGAR · Real-time", color:C.green, bg:C.greenLight, icon:"🔒" },
            ].map((s, i) => (
              <div key={i} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:"16px 20px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                  <div style={{ fontSize:"0.72rem", fontWeight:700, color:C.textSub, textTransform:"uppercase", letterSpacing:"0.05em" }}>{s.label}</div>
                  <div style={{ width:28, height:28, borderRadius:7, background:s.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>{s.icon}</div>
                </div>
                <div style={{ fontSize:"2rem", fontWeight:900, color:C.text, lineHeight:1 }}>{s.value}</div>
                <div style={{ fontSize:"0.72rem", color:s.color, fontWeight:600, marginTop:4 }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {error && (
            <div style={{ background:"#FFF0EB", border:`1px solid ${C.orange}`, borderRadius:12, padding:"12px 16px", color:C.orange, fontSize:"0.875rem", fontWeight:600, marginBottom:24 }}>
              ⚠️ {error} — <button onClick={fetchData} style={{ background:"none", border:"none", color:C.orange, fontWeight:700, cursor:"pointer", textDecoration:"underline" }}>Try again</button>
            </div>
          )}

          {showFiled && (
            <Table title="Filed with SEC (N-1A)" icon="📄" color={C.purple} colorLight={C.purpleLight}
              items={filed} dateLabel="Filed" dateKey="filed" loading={loading}
              emptyMsg="No new N-1A filings found in the past 30 days." />
          )}
          {showLaunched && (
            <Table title="Recently Launched (Live in Market)" icon="🚀" color={C.teal} colorLight={C.tealLight}
              items={launched} dateLabel="Launched" dateKey="launched" loading={loading}
              emptyMsg="No new ETF launches found in the past 30 days." />
          )}

          <div style={{ fontSize:"0.72rem", color:C.textLight, textAlign:"center", paddingBottom:24 }}>
            Data from SEC EDGAR · Emails are best-guess format · Powered by Claude AI
          </div>
        </div>
      </div>
      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        * { box-sizing:border-box; } body { margin:0; }
      `}</style>
    </div>
  );
}
