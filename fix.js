const fs = require('fs');
let code = fs.readFileSync('src/views/Dashboard.jsx', 'utf8');
const regex = /const tools = \[\s*\{\s*id:\s*"chronos"[\s\S]*?\];/;
const newTools = `const tools = [
  { id: "chronos", name: "Chronos Hub", path: "/chronos", icon: "⌚", badge: "" },
  { id: "burner", name: "Burner Pad", path: "/burner", icon: "🔥", badge: "WIPES", badgeColor: "#ef4444" },
  { id: "sop", name: "SOP Engine", path: "/sop", icon: "📋", badge: "CORE", badgeColor: "#3b82f6" },
  { id: "subscriptions", name: "Sub Tracker", path: "/subscriptions", icon: "🔄", badge: "NEW", badgeColor: "#a855f7" },
  { id: "vault", name: "Data Vault", path: "/datavault", icon: "💾", badge: "SAFE", badgeColor: "#06b6d4" },
  { id: "calendar", name: "Master Calendar", path: "/calendar", icon: "📅", badge: "CORE", badgeColor: "#a855f7" },
  { id: "quick", name: "Quick Tip & Tax", path: "/quick", icon: "💸", badge: "FAST", badgeColor: "#10b981" },
  { id: "budget", name: "Budget Engine", path: "/budget", icon: "💵", badge: "CORE", badgeColor: "#10b981" },
  { id: "learning", name: "Learning Center", path: "/learning", icon: "📚", badge: "NEW", badgeColor: "#06b6d4" },
  { id: "calculator", name: "Omni-Calculator", path: "/calculator", icon: "🧮", badge: "" },
  { id: "ledger", name: "Asset Ledger", path: "/ledger", icon: "📋", badge: "" },
  { id: "civics", name: "Civics & Rights", path: "/civics", icon: "⚖️", badge: "" },
  { id: "qrscanner", name: "Universal Lens", path: "/qr-scanner", icon: "📷", badge: "NEW", badgeColor: "#06b6d4" }
];`;
code = code.replace(regex, newTools);
fs.writeFileSync('src/views/Dashboard.jsx', code);
console.log('✅ DASHBOARD FULLY REWRITTEN AND FIXED');
