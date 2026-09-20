const fs = require('fs');
let code = fs.readFileSync('src/views/Dashboard.jsx', 'utf8');

// Wipe any broken attempts to prevent duplicates
code = code.replace(/,\s*\{\s*id:\s*['"]qrscanner['"][^\}]+\}/g, '');

// Surgically inject right after Civics
code = code.replace(/(\{\s*id:\s*['"]civics['"][^\}]+\})/g, '$1,\n  { id: "qrscanner", name: "Universal Lens", path: "/qr-scanner", icon: "📷", badge: "NEW", badgeColor: "#06b6d4" }');

fs.writeFileSync('src/views/Dashboard.jsx', code);
console.log('✅ FORCED INJECTION SUCCESSFUL.');
