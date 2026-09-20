const fs = require('fs');
const path = require('path');

console.log("Starting surgical upgrades...");

// =========================================================================
// 1. UPGRADE CIVICS & RIGHTS (ENCOUNTERS TAB)
// =========================================================================
const civicsPath = 'src/views/CivicsRights.jsx';
if (fs.existsSync(civicsPath)) {
  let civicsCode = fs.readFileSync(civicsPath, 'utf8');

  const encountersData = `
const ENCOUNTERS_GUIDE = [
  {
    title: "The 5th Amendment & Digital Passcodes",
    content: "Under current legal interpretations, the 5th Amendment protects the contents of your mind. Therefore, law enforcement generally CANNOT force you to surrender a memorized alphanumeric passcode. However, your physical traits are not protected. They CAN legally compel you to unlock a device using FaceID, TouchID, or iris scanners. In high-risk environments, temporarily disable biometric unlocking."
  },
  {
    title: "The Encounter Script (Read Aloud)",
    content: "If detained, you do not have to guess what to say. Memorize or read the following: 'I do not consent to any searches of my person, my property, my vehicle, or my digital devices. I invoke my 5th Amendment right to remain silent. I will not answer any questions without my attorney present. Am I being detained, or am I free to go?'"
  },
  {
    title: "Border Searches (Exceptions)",
    content: "Be aware that standard 4th Amendment protections against unreasonable search and seizure are heavily diluted at international borders and ports of entry. Customs and Border Protection (CBP) claims broad authority to perform 'basic' searches of electronic devices without a warrant. Keep highly sensitive data entirely off-device or forensically wiped when crossing borders."
  }
];
`;

  // Inject Data Array
  if (!civicsCode.includes("ENCOUNTERS_GUIDE")) {
    civicsCode = civicsCode.replace("// --- STYLES ---", encountersData + "\n// --- STYLES ---");
  }

  // Update Top Navigation Tabs Array
  civicsCode = civicsCode.replace(
    /\[\s*['"]Amendments['"]\s*,\s*['"]Constitution['"]\s*,\s*['"]Human Rights['"]\s*,\s*['"]Guide['"]\s*\]/g,
    "['Amendments', 'Constitution', 'Human Rights', 'Encounters', 'Guide']"
  );

  // Update Active Color Logic
  if (!civicsCode.includes("tab === 'Encounters'")) {
    civicsCode = civicsCode.replace(
      /if\s*\(\s*tab\s*===\s*['"]Human Rights['"]\s*\)\s*activeColor\s*=\s*['"]#00cc66['"];?/g,
      "if (tab === 'Human Rights') activeColor = '#00cc66';\n      if (tab === 'Encounters') activeColor = '#a855f7';"
    );
  }

  // Inject the Encounters UI 
  const encountersUI = `
        {/* TAB: ENCOUNTERS */}
        {activeTab === 'Encounters' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px', borderLeft: '4px solid #a855f7' }}>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '1.1em', fontWeight: 'bold', color: '#a855f7', textAlign: 'center', textTransform: 'uppercase' }}>Digital & Civil Encounters</h3>
              {ENCOUNTERS_GUIDE.map((enc, idx) => (
                <div key={idx} style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: idx !== ENCOUNTERS_GUIDE.length - 1 ? '1px dashed #333' : 'none' }}>
                  <h4 style={{ color: '#fff', fontSize: '1.05em', marginBottom: '8px', marginTop: '0' }}>{enc.title}</h4>
                  <p style={{ color: '#aaa', fontSize: '0.9em', lineHeight: '1.5', margin: 0 }}>{enc.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
  `;

  // Safely place the new tab right before the Guide tab
  if (!civicsCode.includes("TAB: ENCOUNTERS")) {
    civicsCode = civicsCode.replace(
      /\{\s*activeTab\s*===\s*['"]Guide['"]\s*&&\s*\(/g,
      encountersUI + "\n        {activeTab === 'Guide' && ("
    );
  }

  fs.writeFileSync(civicsPath, civicsCode);
  console.log("✅ CivicsRights.jsx successfully upgraded with the Encounters module.");
} else {
  console.log("⚠️ Could not locate src/views/CivicsRights.jsx");
}

// =========================================================================
// 2. UPGRADE EULA / MANIFESTO (AUTO-DISCOVERY)
// =========================================================================
const filesToSearch = [
  'src/App.jsx', 
  'src/main.jsx', 
  'src/views/Dashboard.jsx', 
  'src/components/BootScreen.jsx', 
  'src/components/Manifesto.jsx'
];

let eulaTargetFile = null;
let eulaContent = '';

// Scan for the EULA
for (let file of filesToSearch) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('6. User Responsibility:')) {
      eulaTargetFile = file;
      eulaContent = content;
      break;
    }
  }
}

if (eulaTargetFile) {
  if (!eulaContent.includes("7. Don't Trust, Verify:")) {
    const newClauses = `</p>
<p style={{ marginBottom: '15px', color: '#ccc', lineHeight: '1.5', fontSize: '0.9rem' }}>
  <strong style={{ color: '#fff' }}>7. Don't Trust, Verify:</strong> This application is proudly fully open-source (GPL-3.0). The codebase is publicly available for independent auditing to mathematically prove the absence of telemetry, trackers, or backdoors. Do not take our word for it—compile it yourself.
</p>
<p style={{ marginBottom: '25px', color: '#ccc', lineHeight: '1.5', fontSize: '0.9rem' }}>
  <strong style={{ color: '#fff' }}>8. Forensic Capabilities:</strong> This suite includes active data-destruction protocols (Panic Wipes) designed to overwrite storage sectors with zero-bytes. The developer cannot recover data you choose to incinerate. You are the sole custodian of your information.`;

    // Inject right after the end of Clause 6's paragraph
    eulaContent = eulaContent.replace(
      /(<strong[^>]*>6\. User Responsibility:<\/strong>[\s\S]*?<\/p>)/,
      `$1\n${newClauses}`
    );

    fs.writeFileSync(eulaTargetFile, eulaContent);
    console.log(`✅ Manifesto EULA successfully upgraded in ${eulaTargetFile}`);
  } else {
    console.log(`✅ Clauses 7 & 8 already exist in ${eulaTargetFile}`);
  }
} else {
  console.log("⚠️ Could not locate the file containing the Manifesto EULA. (If it's in a different folder, let me know the filename!)");
}

console.log("All patches applied safely.");
