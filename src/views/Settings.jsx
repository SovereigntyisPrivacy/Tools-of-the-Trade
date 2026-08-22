import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState('');

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  // --- STYLES ---
  const sectionHeaderStyle = { color: '#00ffff', fontSize: '0.9em', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', margin: '25px 0 10px 0' };
  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };
  const copyBtnStyle = (type) => ({ background: copied === type ? '#00cc66' : '#222', color: copied === type ? '#000' : '#fff', border: 'none', borderRadius: '6px', padding: '8px 15px', fontWeight: 'bold', transition: 'background 0.2s' });

  return (
    <div className="view-wrapper pb-safe" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222' }}>
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h2>Settings & Support</h2>
      </header>

      <div className="calc-content" style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
        
        {/* SOVEREIGN TOOLS PLUG */}
        <div style={{ ...cardStyle, borderTop: '4px solid #ef4444', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2em' }}>🛡️</span> Sovereign Tools
          </h3>
          <p style={{ color: '#aaa', fontSize: '0.95em', lineHeight: '1.5', marginBottom: '15px' }}>
            Take back your privacy. Get the ultimate offline utility and privacy suite.
          </p>
          <button 
            onClick={() => window.open('https://github.com/xNoOnex/SovereignTools1', '_blank')}
            style={{ padding: '10px 20px', background: '#fff', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', width: '100%' }}>
            View Project ➔
          </button>
        </div>

        {/* ========================================== */}
        {/* SUPPORT & DONATION HUB                     */}
        {/* ========================================== */}
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '30px', marginBottom: '10px' }}>
          <span style={{ fontSize: '1.5em' }}>☕</span>
          <h2 style={{ margin: 0, color: '#fff' }}>Support the Creator</h2>
        </div>
        <p style={{ color: '#aaa', fontSize: '0.9em', lineHeight: '1.5', marginBottom: '20px' }}>
          Fund open-source, zero-telemetry development. If this app helps you out in the field, buy me a coffee or support via crypto!
        </p>

        {/* FIAT & MOBILE PAY */}
        <h4 style={sectionHeaderStyle}>FIAT & MOBILE PAY</h4>
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px dashed #333' }}>
            <div>
              <span style={{ color: '#888', fontSize: '0.8em', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Cash App</span>
              <strong style={{ color: '#fff', fontSize: '1.1em' }}>$xNoOnesSovereignx</strong>
            </div>
            <button onClick={() => handleCopy('$xNoOnesSovereignx', 'cashapp')} style={copyBtnStyle('cashapp')}>{copied === 'cashapp' ? 'Copied!' : 'Copy'}</button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ color: '#888', fontSize: '0.8em', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>PayPal</span>
              <strong style={{ color: '#fff', fontSize: '1.1em' }}>@xNoOnex</strong>
            </div>
            <button onClick={() => handleCopy('@xNoOnex', 'paypal')} style={copyBtnStyle('paypal')}>{copied === 'paypal' ? 'Copied!' : 'Copy'}</button>
          </div>
        </div>

        {/* CRYPTOCURRENCY */}
        <h4 style={sectionHeaderStyle}>CRYPTOCURRENCY (ENCRYPTED & SOVEREIGN)</h4>
        
        {/* Monero */}
        <div style={{ ...cardStyle, borderLeft: '4px solid #f97316' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ color: '#f97316', fontWeight: 'bold' }}>🔒 MONERO (XMR) - PRIVATE</span>
            <button onClick={() => handleCopy('4Au1YdG77bHaRCMP6QtjYHDopBPWAUi9BeJm2HcAbu7NtQKWnBm4CK7nL4NxDUMyGAML9aj61r2GQat9PrsHSiD1qc1jeR', 'xmr')} style={copyBtnStyle('xmr')}>{copied === 'xmr' ? 'Copied!' : 'Copy'}</button>
          </div>
          <div style={{ background: '#000', padding: '10px', borderRadius: '8px', border: '1px solid #333', color: '#888', fontSize: '0.8em', wordBreak: 'break-all', fontFamily: 'monospace' }}>
            4Au1YdG77bHaRCMP6QtjYHDopBPWAUi9BeJm2HcAbu7NtQKWnBm4CK7nL4NxDUMyGAML9aj61r2GQat9PrsHSiD1qc1jeR
          </div>
        </div>

        {/* Bitcoin */}
        <div style={{ ...cardStyle, borderLeft: '4px solid #fbbf24' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>🪙 BITCOIN (BTC)</span>
            <button onClick={() => handleCopy('bc1q7e20apd7cmdhkurwtxee29298cqs4sc3aa6xf', 'btc')} style={copyBtnStyle('btc')}>{copied === 'btc' ? 'Copied!' : 'Copy'}</button>
          </div>
          <div style={{ background: '#000', padding: '10px', borderRadius: '8px', border: '1px solid #333', color: '#888', fontSize: '0.8em', wordBreak: 'break-all', fontFamily: 'monospace' }}>
            bc1q7e20apd7cmdhkurwtxee29298cqs4sc3aa6xf
          </div>
        </div>

        {/* Solana */}
        <div style={{ ...cardStyle, borderLeft: '4px solid #c084fc' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ color: '#c084fc', fontWeight: 'bold' }}>⚡ SOLANA (SOL)</span>
            <button onClick={() => handleCopy('DsKG8cEUyDydMQRBzenHFjpo9ZRvrRadmL4Nu2xAHBmS', 'sol')} style={copyBtnStyle('sol')}>{copied === 'sol' ? 'Copied!' : 'Copy'}</button>
          </div>
          <div style={{ background: '#000', padding: '10px', borderRadius: '8px', border: '1px solid #333', color: '#888', fontSize: '0.8em', wordBreak: 'break-all', fontFamily: 'monospace' }}>
            DsKG8cEUyDydMQRBzenHFjpo9ZRvrRadmL4Nu2xAHBmS
          </div>
        </div>

        {/* DISCLAIMER & PGP */}
        <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(239, 68, 68, 0.05)', border: '1px dashed #ef4444', borderRadius: '12px' }}>
          <p style={{ color: '#aaa', fontSize: '0.85em', margin: '0 0 10px 0', lineHeight: '1.4' }}>
            ℹ️ <strong>About Support Tools of the Trade:</strong> Donations directly fund local tooling development, privacy research, and open-source updates.
          </p>
          <p style={{ color: '#f59e0b', fontSize: '0.85em', margin: 0, fontWeight: 'bold' }}>
            ⚠️ Disclaimer: Thank you for supporting decentralized independence.
          </p>
        </div>

        <div style={{ marginTop: '20px', marginBottom: '50px' }}>
          <h4 style={{ color: '#00cc66', fontSize: '0.9em', fontWeight: 'bold', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🛡️ ENCRYPTED COMMS (PGP)
          </h4>
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.5em' }}>✉️</span>
                <div>
                  <span style={{ color: '#888', fontSize: '0.75em', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>DNMX Darknet Mail</span>
                  <strong style={{ color: '#fff', fontSize: '1.0em' }}>xNoOnex@dnmx.cc</strong>
                </div>
              </div>
              <button onClick={() => handleCopy('xNoOnex@dnmx.cc', 'email')} style={copyBtnStyle('email')}>{copied === 'email' ? 'Copied!' : 'Copy'}</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
