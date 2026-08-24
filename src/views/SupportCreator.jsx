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

  const sectionHeaderStyle = { color: '#00ffff', fontSize: '0.85em', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px', marginTop: '20px', fontWeight: 'bold' };
  const cardStyle = { background: '#111', borderRadius: '16px', padding: '20px', marginBottom: '15px' };
  const copyBtnStyle = { background: '#333', color: '#aaa', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold' };

  return (
    <div className="view-wrapper" style={{ background: '#000', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '8px', fontWeight: 'bold' }}>← Settings</button>
        <button onClick={() => navigate('/')} style={{ background: 'transparent', border: 'none', fontSize: '1.5em' }}>🏠</button>
      </header>

      <div style={{ padding: '20px', flex: 1, overflowY: 'auto', paddingBottom: '95px' }}>
        
        <h2 style={{ color: '#fff', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>☕ Support the Creator</h2>
        <p style={{ color: '#aaa', fontSize: '0.9em', lineHeight: '1.5', margin: '0 0 20px 0' }}>
          Fund open-source, zero-telemetry development. Buy me a coffee or support via crypto!
        </p>

        {copied && <div style={{ background: '#00cc66', color: '#000', padding: '10px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold', marginBottom: '15px' }}>Copied {copied}!</div>}

        <div style={sectionHeaderStyle}>FIAT & MOBILE PAY</div>
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <div>
              <div style={{ color: '#888', fontSize: '0.75em', textTransform: 'uppercase', marginBottom: '4px' }}>Cash App</div>
              <div style={{ color: '#fff', fontSize: '1.2em' }}>$xNoOnesSovereignx</div>
            </div>
            <button onClick={() => copyToClipboard('$xNoOnesSovereignx', 'Cash App')} style={copyBtnStyle}>Copy</button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: '#888', fontSize: '0.75em', textTransform: 'uppercase', marginBottom: '4px' }}>PayPal</div>
              <div style={{ color: '#fff', fontSize: '1.2em' }}>@xNoOnex</div>
            </div>
            <button onClick={() => copyToClipboard('@xNoOnex', 'PayPal')} style={copyBtnStyle}>Copy</button>
          </div>
        </div>

        <div style={{...sectionHeaderStyle, color: '#f59e0b'}}>CRYPTOCURRENCY (ENCRYPTED & SOVEREIGN)</div>
        
        <div style={cardStyle}>
          <div style={{ color: '#f59e0b', fontSize: '0.85em', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
             🔒 MONERO (XMR) - PRIVATE
          </div>
          <div style={{ color: '#888', fontFamily: 'monospace', fontSize: '0.8em', wordBreak: 'break-all', background: '#000', padding: '15px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #222' }}>
            4Au1YdG77bHaRCMP6QtjYHDoBpWAUi9BeJm2HcAbu7NtQKWnB4CK7nL4NxDUMyGAML9aj61r2GQa9PrsHSiD1qcjeR
          </div>
          <button onClick={() => copyToClipboard('4Au1YdG77bHaRCMP6QtjYHDoBpWAUi9BeJm2HcAbu7NtQKWnB4CK7nL4NxDUMyGAML9aj61r2GQa9PrsHSiD1qcjeR', 'Monero')} style={{ width: '100%', ...copyBtnStyle }}>Copy Monero Address</button>
        </div>

        <div style={cardStyle}>
          <div style={{ color: '#f59e0b', fontSize: '0.85em', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
             🪙 BITCOIN (BTC)
          </div>
          <div style={{ color: '#888', fontFamily: 'monospace', fontSize: '0.8em', wordBreak: 'break-all', background: '#000', padding: '15px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #222' }}>
            bc1q7e20apd7cmdhkurwtxee29298cqs4sc3aa6xf
          </div>
          <button onClick={() => copyToClipboard('bc1q7e20apd7cmdhkurwtxee29298cqs4sc3aa6xf', 'Bitcoin')} style={{ width: '100%', ...copyBtnStyle }}>Copy Bitcoin Address</button>
        </div>

      </div>
    </div>
  );
}
