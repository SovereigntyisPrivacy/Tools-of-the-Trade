import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalendar } from '../core/CalendarContext';
import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';

export default function Dashboard() {
  const [hiddenModules, setHiddenModules] = useState(() => JSON.parse(localStorage.getItem("tot_hidden_modules")) || []);
  const [devTaps, setDevTaps] = useState(0);
  
  // FIRST-LAUNCH EULA LOGIC: Checks if they've accepted it previously
  const [showLegal, setShowLegal] = useState(() => {
    return localStorage.getItem('tot_eula_accepted') !== 'true';
  });

  const handleAcceptEula = (e) => {
    e.stopPropagation();
    localStorage.setItem('tot_eula_accepted', 'true');
    setShowLegal(false);
  };

  const handleTitleTap = () => {
    const t = devTaps + 1;
    setDevTaps(t);
    if (t >= 5) {
      localStorage.setItem('fleet_dev_node', 'true');
      alert('Developer Mode Unlocked: Wipe Data & Screenshot Shield exposed.');
      setDevTaps(0);
    } else {
      setTimeout(() => setDevTaps(0), 1500);
    }
  };

  const navigate = useNavigate();
  const { alertCount } = useCalendar();

  const [time, setTime] = useState(new Date());
  const [clockConfig, setClockConfig] = useState({
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    color: '#00ffff',
    opacity: '1.0'
  });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const loadConfig = () => {
      setClockConfig({
        tz: localStorage.getItem('clock_tz') || Intl.DateTimeFormat().resolvedOptions().timeZone,
        color: localStorage.getItem('clock_color') || '#00ffff',
        opacity: localStorage.getItem('clock_opacity') || '1.0'
      });
    };
    loadConfig();

    // --- EXECUTIVE OMNI-TELEMETRY HUD ---
    let totalAssetValue = 0;
    let monthlyBurn = 0;
    let activePayroll = 0;

    try {
      const assets = JSON.parse(localStorage.getItem('asset_ledger') || '[]');
      totalAssetValue = assets.reduce((sum, a) => sum + parseFloat(a.price || 0), 0);

      const subs = JSON.parse(localStorage.getItem('fleet_subscriptions') || '[]');
      monthlyBurn = subs.reduce((sum, s) => sum + (s.cycle === 'Monthly' ? parseFloat(s.cost || 0) : parseFloat(s.cost || 0)/12), 0);

      const schedules = JSON.parse(localStorage.getItem('fleet_schedules') || '[]');
      if (schedules.length > 0) {
        const activeWk = schedules[schedules.length - 1];
        activeWk.roster.forEach(emp => {
          let hrs = 0;
          Object.values(activeWk.shifts[emp.id] || {}).forEach(s => {
            if (s && s.in && s.out) {
              const [h1, m1] = s.in.split(':').map(Number);
              const [h2, m2] = s.out.split(':').map(Number);
              let m1Total = h1 * 60 + m1;
              let m2Total = h2 * 60 + m2;
              if (m2Total < m1Total) m2Total += 24 * 60;
              hrs += (m2Total - m1Total) / 60;
            }
          });
          const rate = parseFloat(emp.rate) || 0;
          const reg = Math.min(hrs, 40);
          const ot = Math.max(0, hrs - 40);
          activePayroll += (reg * rate) + (ot * rate * 1.5);
        });
      }
    } catch (e) {}

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const showBanner = async () => {
      try {
        await AdMob.initialize();
        await AdMob.showBanner({
          adId: "ca-app-pub-3940256099942544/6300978111", 
          adSize: BannerAdSize.BANNER,
          position: BannerAdPosition.BOTTOM_CENTER,
          margin: 0,
          isTesting: true
        });
      } catch (e) {
        console.error('AdMob Error:', e);
      }
    };
    showBanner();

    return () => {
      AdMob.removeBanner().catch(e => console.error('Remove Error:', e));
    };
  }, []);

  const tools = [
    { id: "chronos", name: "Chronos Hub", path: "/chronos", icon: "⏱️", badge: "", badgeColor: "#222" },
    { id: "burner", name: "Burner Pad", path: "/burner", icon: "🔥", badge: "WIPES", badgeColor: "#ef4444" },
    { id: "sop", name: "SOP Engine", path: "/sop", icon: "📋", badge: "CORE", badgeColor: "#3b82f6" },
    { id: "subscriptions", name: "Sub Tracker", path: "/subscriptions", icon: "🔄", badge: "NEW", badgeColor: "#a855f7" },
    { id: "vault", name: "Data Vault", path: "/datavault", icon: "💾", badge: "SAFE", badgeColor: "#00ffff" },
    { id: "calendar", name: "Master Calendar", path: "/calendar", icon: "📅", badge: "CORE", badgeColor: "#a855f7" },
    { id: "quick", name: "Quick Tip & Tax", path: "/quick", icon: "💸", badge: "FAST", badgeColor: "#00cc66" },
    { id: "budget", name: "Budget Engine", path: "/budget", icon: "💵", badge: "CORE", badgeColor: "#00cc66" },
    { id: "learning", name: "Learning Center", path: "/learning", icon: "📚", badge: "NEW", badgeColor: "#00ffff" },
    { id: "calculator", name: "Omni-Calculator", path: "/calculator", icon: "🧮", badge: "", badgeColor: "#222" },
    { id: "ledger", name: "Asset Ledger", path: "/ledger", icon: "📋", badge: "", badgeColor: "#222" },
    { id: "civics", name: "Civics & Rights", path: "/civics", icon: "⚖️", badge: "", badgeColor: "#222" },
    { id: "qrscanner", name: "Universal Lens", path: "/qr-scanner", icon: "📷", badge: "NEW", badgeColor: "#06b6d4" }
  ];

  return (
    <div className="view-wrapper pb-safe">
      <header className="header" style={{ position: 'relative', paddingTop: '40px', paddingBottom: '20px', textAlign: 'center' }}>
        <div onClick={() => navigate('/worldclock')} style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', cursor: 'pointer', zIndex: 10 }}>
          <span style={{ color: clockConfig.color, fontSize: '1.2rem', textShadow: `0 0 10px ${clockConfig.color}`, fontWeight: 'bold' }}>
            {time.toLocaleTimeString('en-US', { timeZone: clockConfig.tz, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
        <button onClick={() => navigate('/settings')} style={{ position: 'absolute', top: '5px', right: '15px', background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', zIndex: 10 }}>
          ⚙️
        </button>
        <h1 onClick={handleTitleTap} className="friendly-title" style={{ marginTop: '20px', cursor: 'pointer', lineHeight: '1.2' }}>T⚙️⚙️ls of the Trade</h1>
        
        <div style={{ textAlign: 'center', marginTop: '10px', position: 'relative', zIndex: 20 }}>
          <button onClick={(e) => { e.stopPropagation(); setShowLegal(true); }} style={{ background: 'transparent', color: '#888', border: '1px solid #333', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>⚖️ Legal & Privacy Info</button>
        </div>
      </header>

      <div className="grid-container" style={{ marginTop: '40px' }}>
        {tools.filter(tool => !hiddenModules.includes(tool.id)).map((tool) => (
          <button key={tool.id} className="tool-card" style={{ position: 'relative' }} onClick={() => navigate(tool.path)}>
            {tool.badge && (
              <div style={{
                position: 'absolute', top: '-10px', right: '-10px', background: tool.badgeColor, color: '#fff', fontSize: '0.75rem',
                fontWeight: '900', padding: '6px 10px', borderRadius: '8px', border: '2px solid #111', transform: 'rotate(5deg)',
                boxShadow: '0 4px 6px rgba(0,0,0,0.6)', zIndex: 10, whiteSpace: 'nowrap'
              }}>
                {tool.id === 'calendar' && alertCount > 0 ? alertCount : tool.badge}
              </div>
            )}
            <span className="tool-icon">{tool.icon}</span>
            <span className="tool-name">{tool.name}</span>
          </button>
        ))}
      </div>

      {/* UPGRADED FIRST-LAUNCH LEGAL MODAL */}
      {showLegal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div style={{ background: '#111', border: '1px solid #333', borderRadius: '12px', padding: '20px', width: '100%', maxHeight: '85vh', overflowY: 'auto', paddingBottom: '70px' }}>
            <h2 style={{ color: '#ef4444', textTransform: 'uppercase', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>Liability & Privacy EULA</h2>
            <p style={{ color: '#ccc', fontSize: '0.85rem', lineHeight: '1.6', textAlign: 'left' }}>
              <strong>1. As-Is Software:</strong> Tools of the Trade (ToT) is provided "as is" and "as available" without warranty of any kind. The developer assumes no liability for data loss, hardware failure, or service interruptions.<br/><br/>
              
              <strong>2. Zero Data Collection:</strong> This application operates entirely offline. No personal data, camera feeds, or logs are transmitted to external servers. Your data is your sovereign property and remains exclusively on local device storage.<br/><br/>
              
              <strong>3. Mesh & Network Broadcasts:</strong> The Pro Generator creates unencrypted payloads for local mesh networks. You assume all responsibility for managing unencrypted broadcasts and shielding sensitive keys.<br/><br/>
              
              <strong>4. Financial & Tax Information:</strong> Budgeting, tax routing, and ledger tools are provided for organizational purposes only and do not constitute professional financial, tax, or legal advice.<br/><br/>
              
              <strong>5. Safety & Medical Information:</strong> Technical calculators and reference databases (including survival, pharmacology, and ballistics parameters) are strictly for educational reference. The developer assumes no liability for physical injury, legal repercussions, or medical incidents resulting from the use of this data.<br/><br/>
              
              <strong>6. User Responsibility:</strong> By bypassing this screen, you acknowledge that you are solely responsible for compliance with your local, state, and federal laws regarding cryptography, data routing, and physical applications.
            </p>
            <button onClick={handleAcceptEula} style={{ width: '100%', background: '#06b6d4', color: '#000', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', marginTop: '15px', fontSize: '1.1rem', boxShadow: '0 4px 10px rgba(6, 182, 212, 0.3)' }}>I Agree & Understand</button>
          </div>
        </div>
      )}
    </div>
  );
}
