const fs = require('fs');
const file = 'src/views/Dashboard.jsx';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('showLegal')) {
  // 1. Inject State
  code = code.replace(/const navigate = useNavigate\(\);/, "const navigate = useNavigate();\n  const [showLegal, setShowLegal] = useState(false);");
  
  // 2. Inject Button directly under the h1 title
  code = code.replace(/<\/h1>/, `</h1>\n        <div style={{ textAlign: 'center', marginTop: '10px', position: 'relative', zIndex: 20 }}>\n          <button onClick={(e) => { e.stopPropagation(); setShowLegal(true); }} style={{ background: 'transparent', color: '#888', border: '1px solid #333', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>⚖️ Legal & Privacy Info</button>\n        </div>`);
  
  // 3. Inject Modal at the bottom
  const modal = `
      {showLegal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div style={{ background: '#111', border: '1px solid #333', borderRadius: '12px', padding: '20px', width: '100%', maxHeight: '80vh', overflowY: 'auto' }}>
            <h2 style={{ color: '#ef4444', textTransform: 'uppercase', marginTop: 0 }}>Liability & Privacy EULA</h2>
            <p style={{ color: '#ccc', fontSize: '0.85rem', lineHeight: '1.5', textAlign: 'left' }}>
              <strong>1. As-Is Software:</strong> Tools of the Trade (ToT) is provided "as is" and "as available" without warranty of any kind. The developer assumes no liability for data loss, financial discrepancies, or hardware failure resulting from the use of this software.<br/><br/>
              <strong>2. Zero Data Collection:</strong> This application operates entirely offline. No personal data, camera feeds, or financial logs are transmitted to external servers. All data remains exclusively on local device storage.<br/><br/>
              <strong>3. Mesh & Network Broadcasts:</strong> The Pro Generator is capable of creating unencrypted data payloads for local mesh networks. The user assumes all responsibility for managing unencrypted broadcasts and shielding sensitive keys.<br/><br/>
              <strong>4. User Responsibility:</strong> By bypassing this screen, you acknowledge that you are solely responsible for compliance with your local laws regarding cryptography, data routing, and scanning hardware.
            </p>
            <button onClick={(e) => { e.stopPropagation(); setShowLegal(false); }} style={{ width: '100%', background: '#06b6d4', color: '#000', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', marginTop: '15px', fontSize: '1.1rem' }}>I Agree & Understand</button>
          </div>
        </div>
      )}`;
      
  const returnIndex = code.lastIndexOf('</div>');
  code = code.substring(0, returnIndex) + modal + '\n      ' + code.substring(returnIndex);
  
  fs.writeFileSync(file, code);
  console.log('✅ Legal Shield perfectly injected into Dashboard.jsx');
} else {
  console.log('⚠️ Legal Shield is already present!');
}
