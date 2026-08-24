import GhostTap from '../components/GhostTap';
import React, { useState, useEffect } from 'react';



import { useNavigate } from 'react-router-dom';
import { useCalendar } from '../core/CalendarContext';
import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';

function Dashboard() {

  const [gearTaps, setGearTaps] = useState(0);
  const handleGearTap = () => {
    const t = gearTaps + 1;
    setGearTaps(t);
    if (t >= 5) {
      setGearTaps(0);
      navigate('/settings');
    } else {
      setTimeout(() => setGearTaps(0), 1500);
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
      const activeWk = schedules[schedules.length - 1]; // Grabs the most recently generated week
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
  } catch(e) {}

  return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const showBanner = async () => {
      try {
        await AdMob.initialize();
        await AdMob.showBanner({
          adId: "ca-app-pub-3940256099942544/6300978111", // Standard Google Test ID
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

    // SURGICAL FIX: Destroy the native banner when the component unmounts
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
    { id: "learning", name: "Learning Center", path: "/learning", icon: "📚", badge: "NEW", badgeColor: "#00ffff" },
    { id: "calculator", name: "Omni-Calculator", path: "/calculator", icon: "🧮" },
    { id: "ledger", name: "Asset Ledger", path: "/ledger", icon: "📋" },
    { id: "civics", name: "Civics & Rights", path: "/civics", icon: "⚖️" }
  ];

  return (
    <div className="view-wrapper pb-safe">
      <GhostTap />
      <button onClick={handleGearTap} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}>
        ⚙️
      </button>
      
      <header className="header" style={{ paddingTop: '40px' }}>
        
      <div 
        onClick={() => navigate('/worldclock')}
        style={{
          position: 'absolute', top: '15px', left: '50%', transform: 'translateX(-50%)',
          color: clockConfig.color, opacity: parseFloat(clockConfig.opacity),
          fontSize: '1.1rem', fontWeight: '900', letterSpacing: '2px', cursor: 'pointer',
          textShadow: `0 0 10px ${clockConfig.color}`, zIndex: 100
        }}
      >
        {time.toLocaleTimeString('en-US', { timeZone: clockConfig.tz, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </div>
        <h1 className="friendly-title" style={{ lineHeight: '1.2', paddingBottom: '10px' }}>T⚙️⚙️ls of the Trade</h1>
      </header>

      <div className="grid-container" style={{ marginTop: '40px' }}>
        {tools.map((tool) => (
          <button 
            key={tool.id}
            className="tool-card"
            style={{ position: 'relative' }}
            onClick={() => navigate(tool.path)}
          >
            {tool.badge && (
              <div style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                background: tool.badgeColor,
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: '900',
                padding: '6px 10px',
                borderRadius: '8px',
                border: '2px solid #111',
                transform: 'rotate(5deg)',
                boxShadow: '0 4px 6px rgba(0,0,0,0.6)',
                zIndex: 10,
                whiteSpace: 'nowrap'
              }}>
                {tool.id === 'calendar' && alertCount > 0 ? alertCount : tool.badge}
              </div>
            )}
            <span className="tool-icon">{tool.icon}</span>
            <span className="tool-name">{tool.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;