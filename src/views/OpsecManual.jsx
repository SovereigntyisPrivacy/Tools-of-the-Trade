import React from 'react';
import { useNavigate } from 'react-router-dom';

const OPSEC_GUIDE = [
  {
    id: 'pillar-1',
    title: 'I. Threat Modeling',
    icon: '🎯',
    color: '#ef4444',
    content: 'OpSec begins with identifying your adversary. You cannot protect against everything simultaneously without crippling your utility. Define your threat model:\n\n• Who is the adversary? (Corporate trackers, local LE, nation-state?)\n• What are they after? (Location data, financial ledgers, comms?)\n• What are their capabilities?\n\nDesign your security posture around the most likely threat, not the most extreme cinematic scenario.'
  },
  {
    id: 'pillar-2',
    title: 'II. Mobile Device Hardening',
    icon: '📱',
    color: '#3b82f6',
    content: 'Your mobile device is a localized surveillance node. Mitigate this baseline exposure:\n\n• Biometrics are NOT protected by the 5th Amendment. Use strong alphanumeric passcodes (8+ characters) in high-risk zones.\n• Disable cloud backups for sensitive data. Cloud servers hold decryption keys.\n• Compartmentalization: Do not mix operational profiles. Use separate hardware or strict software profiles (like Qubes or GrapheneOS work profiles) for secure tasks.'
  },
  {
    id: 'pillar-3',
    title: 'III. Tactical Communications',
    icon: '📡',
    color: '#a855f7',
    content: 'Never trust cellular carrier networks (SMS/MMS) or unencrypted social platforms. They are heavily logged and retained.\n\n• E2EE Protocols: Utilize Signal or Session for internet-based routing.\n• Mesh Networking: In denied environments (no cell service), utilize 900MHz LoRa mesh networks (e.g., Meshtastic) for decentralized, off-grid text routing up to 10+ miles.\n• Metadata is often more dangerous than the payload itself. Who you talk to, and when, paints a complete picture.'
  },
  {
    id: 'pillar-4',
    title: 'IV. Data Custody & Destruction',
    icon: '🔥',
    color: '#f59e0b',
    content: 'If you do not hold the physical storage, you do not own the data.\n\n• Air-Gapping: Keep high-value ledgers, master passwords, and crypto seed phrases entirely offline.\n• Panic Protocols: Utilize cryptographic wiping (overwriting sectors with zero-bytes) for sensitive local vaults. Deleting a file normally only removes the filesystem pointer; the data remains forensically recoverable until overwritten.'
  }
];

export default function OpsecManual() {
  const navigate = useNavigate();

  return (
    <div className="view-wrapper pb-safe" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', marginRight: '15px' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#3b82f6', fontSize: '1.2em', textTransform: 'uppercase', letterSpacing: '1px' }}>OpSec Field Manual</h2>
      </header>

      <div style={{ padding: '20px', overflowY: 'auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <h1 style={{ color: '#fff', margin: '0 0 10px 0', fontSize: '2em' }}>OPERATIONAL SECURITY</h1>
          <p style={{ color: '#888', margin: 0, fontSize: '0.9em', fontStyle: 'italic' }}>Standard operating procedures for digital survival.</p>
        </div>

        {OPSEC_GUIDE.map((section) => (
          <div key={section.id} style={{ background: '#111', borderRadius: '12px', border: '1px solid #333', borderTop: `4px solid ${section.color}`, padding: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
              <span style={{ fontSize: '2em' }}>{section.icon}</span>
              <h3 style={{ color: section.color, margin: 0, fontSize: '1.2em', textTransform: 'uppercase' }}>{section.title}</h3>
            </div>
            <div style={{ color: '#ccc', lineHeight: '1.6', fontSize: '0.95em', whiteSpace: 'pre-line' }}>
              {section.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
