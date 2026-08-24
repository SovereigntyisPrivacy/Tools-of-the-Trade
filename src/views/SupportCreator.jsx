import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SupportCreator() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState('');

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };

  return (
    <div className="view-wrapper" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Settings</button>
        <h2 style={{ margin: 0, color: '#fff', fontSize: '1.2em' }}>☕ Support the Creator</h2>
      </header>

      <div style={{ padding: '15px', flex: 1, overflowY: 'auto', paddingBottom: '95px' }}>
        {copied && <div style={{ background: '#00cc66', color: '#000', padding: '10px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold', marginBottom: '15px' }}>Copied {copied} to clipboard!</div>}

        <p style={{ color: '#aaa', fontSize: '0.9em', lineHeight: '1.4', marginBottom: '20px' }}>
          Fund open-source, zero-telemetry development. Buy me a coffee or support via crypto!
        </p>

        <h3 style={{ color: '#00ffff', fontSize: '0.9em', textTransform: 'uppercase', marginBottom: '10px' }}>Fiat & Mobile Pay</h3>
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <div>
              <div style={{ color: '#888', fontSize: '0.75em', textTransform: 'uppercase' }}>Cash App</div>
              <div style={{ color: '#fff', fontFamily: 'monospace', fontWeight: 'bold' }}>$xNoOnesSovereignx</div>
            </div>
            <button onClick={() => copyToClipboard('$xNoOnesSovereignx', 'Cash App')} style={{ background: '#222', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px' }}>Copy</button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: '#888', fontSize: '0.75em', textTransform: 'uppercase' }}>PayPal</div>
              <div style={{ color: '#fff', fontFamily: 'monospace', fontWeight: 'bold' }}>@xNoOnex</div>
            </div>
            <button onClick={() => copyToClipboard('@xNoOnex', 'PayPal')} style={{ background: '#222', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px' }}>Copy</button>
          </div>
        </div>

        <h3 style={{ color: '#f59e0b', fontSize: '0.9em', textTransform: 'uppercase', marginBottom: '10px' }}>Cryptocurrency (Encrypted & Sovereign)</h3>
        
        <div style={cardStyle}>
          <div style={{ marginBottom: '10px' }}>
            <div style={{ color: '#f59e0b', fontSize: '0.75em', textTransform: 'uppercase', fontWeight: 'bold' }}>Monero (XMR) - Private</div>
            <div style={{ color: '#888', fontFamily: 'monospace', fontSize: '0.75em', wordBreak: 'break-all', background: '#000', padding: '8px', borderRadius: '6px', margin: '5px 0' }}>4Au1YdG77bHaRCMP6QtjYHDoBpWAUi9BeJm2HcAbu7NtQKWnB4CK7nL4NxDUMyGAML9aj61r2GQa9PrsHSiD1qcjeR</div>
            <button onClick={() => copyToClipboard('4Au1YdG77bHaRCMP6QtjYHDoBpWAUi9BeJm2HcAbu7NtQKWnB4CK7nL4NxDUMyGAML9aj61r2GQa9PrsHSiD1qcjeR', 'Monero')} style={{ width: '100%', background: '#222', color: '#fff', border: 'none', padding: '6px', borderRadius: '6px', fontSize: '0.8em' }}>Copy Monero Address</button>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ marginBottom: '10px' }}>
            <div style={{ color: '#f59e0b', fontSize: '0.75em', textTransform: 'uppercase', fontWeight: 'bold' }}>Bitcoin (BTC)</div>
            <div style={{ color: '#888', fontFamily: 'monospace', fontSize: '0.75em', wordBreak: 'break-all', background: '#000', padding: '8px', borderRadius: '6px', margin: '5px 0' }}>bc1q7e20apd7cmdhkurwtxee29298cqs4sc3aa6xf</div>
            <button onClick={() => copyToClipboard('bc1q7e20apd7cmdhkurwtxee29298cqs4sc3aa6xf', 'Bitcoin')} style={{ width: '100%', background: '#222', color: '#fff', border: 'none', padding: '6px', borderRadius: '6px', fontSize: '0.8em' }}>Copy Bitcoin Address</button>
          </div>
        </div>

        <div style={cardStyle}>
          <div>
            <div style={{ color: '#a855f7', fontSize: '0.75em', textTransform: 'uppercase', fontWeight: 'bold' }}>Solana (SOL)</div>
            <div style={{ color: '#888', fontFamily: 'monospace', fontSize: '0.75em', wordBreak: 'break-all', background: '#000', padding: '8px', borderRadius: '6px', margin: '5px 0' }}>DsKG8cEUyDydMQRBzenHFjpo9ZRvrRadmL4Nu2xAHBmS</div>
            <button onClick={() => copyToClipboard('DsKG8cEUyDydMQRBzenHFjpo9ZRvrRadmL4Nu2xAHBmS', 'Solana')} style={{ width: '100%', background: '#222', color: '#fff', border: 'none', padding: '6px', borderRadius: '6px', fontSize: '0.8em' }}>Copy Solana Address</button>
          </div>
        </div>

      </div>
    </div>
  );
}
