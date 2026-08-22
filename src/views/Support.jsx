import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Support() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState('');

  const pgpKey = `-----BEGIN PGP PUBLIC KEY BLOCK-----

xjMEaoFzPxYJKwYBBAHaRw8BAQdA1/wnbV/AAlNfRozavThblIpjh5btYl6D
BBMo8NHNnuvNJVNvdmVyZWlnbiBOb2RlIDxub2RlQHNvdmVyZWlnbi5sb2Nh
bD7CwBMEExYKAIUFgmqBcz8DCwkHCRA1vXF7UTzeJkUUAAAAAAAcACBzYWx0
QG5vdGF0aW9ucy5vcGVucGdwanMub3Jn/PiRhA6q0c/MI61yqOHAEZcHHP8I
mH4LkZ6P/gkP70oFFQoIDgwEFgACAQIZAQKbAwIeARYhBCG+FVKBAnPFk/GN
VDW9cXtRPN4mAAAo9gEA3yT3ATX06/izHaX0dKX/B2ZeO+90brtEnm4aGMsk
P/wA/0TpoQ0mVcP9Qx23jFKdPWGHFFflU2TM3XNybhuZ3GQEzjgEaoFzPxIK
KwYBBAGXVQEFAQEHQGUz2irsZqLfipxoJsnvkPgMQ9GnPaZyYbFh7zLi2tdT
AwEIB8K+BBgWCgBwBYJqgXM/CRA1vXF7UTzeJkUUAAAAAAAcACBzYWx0QG5v
dGF0aW9ucy5vcGVucGdwanMub3Jn/Hzp1hYoVxOxNUE9LJrz3zrwpmiG17Ko
YPmuhXFPjq4CmwwWIQQhvhVSgQJzxZPxjVQ1vXF7UTzeJgAAo/AA/0dX+YzL
f14xTA+YmOZ4feXKKj6dDePVLSkNyzzhPqYFAQDy5OfN80zrbT5g+WY9rfhE
fgKvjHdzrmDg82zium5fCA==
=SFFM
-----END PGP PUBLIC KEY BLOCK-----`;

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const sectionHeaderStyle = { color: '#00ffff', fontSize: '0.9em', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', margin: '25px 0 10px 0' };
  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };
  const copyBtnStyle = (type) => ({ background: copied === type ? '#00cc66' : '#222', color: copied === type ? '#000' : '#fff', border: 'none', borderRadius: '6px', padding: '8px 15px', fontWeight: 'bold', transition: 'background 0.2s' });

  return (
    <div className="view-wrapper pb-safe" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222' }}>
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h2>Support & Custom Builds</h2>
      </header>

      <div className="calc-content" style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <span style={{ fontSize: '1.5em' }}>☕</span>
          <h2 style={{ margin: 0, color: '#fff' }}>Support the Creator</h2>
        </div>
        <p style={{ color: '#aaa', fontSize: '0.9em', lineHeight: '1.5', marginBottom: '20px' }}>
          Fund open-source, zero-telemetry development, or reach out securely to request custom ad-free personal builds!
        </p>

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

        <h4 style={sectionHeaderStyle}>CRYPTOCURRENCY (ENCRYPTED & SOVEREIGN)</h4>
        
        <div style={{ ...cardStyle, borderLeft: '4px solid #f97316' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ color: '#f97316', fontWeight: 'bold' }}>🔒 MONERO (XMR) - PRIVATE</span>
            <button onClick={() => handleCopy('4Au1YdG77bHaRCMP6QtjYHDopBPWAUi9BeJm2HcAbu7NtQKWnBm4CK7nL4NxDUMyGAML9aj61r2GQat9PrsHSiD1qc1jeR', 'xmr')} style={copyBtnStyle('xmr')}>{copied === 'xmr' ? 'Copied!' : 'Copy'}</button>
          </div>
          <div style={{ background: '#000', padding: '10px', borderRadius: '8px', border: '1px solid #333', color: '#888', fontSize: '0.8em', wordBreak: 'break-all', fontFamily: 'monospace' }}>
            4Au1YdG77bHaRCMP6QtjYHDopBPWAUi9BeJm2HcAbu7NtQKWnBm4CK7nL4NxDUMyGAML9aj61r2GQat9PrsHSiD1qc1jeR
          </div>
        </div>

        <div style={{ ...cardStyle, borderLeft: '4px solid #fbbf24' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>🪙 BITCOIN (BTC)</span>
            <button onClick={() => handleCopy('bc1q7e20apd7cmdhkurwtxee29298cqs4sc3aa6xf', 'btc')} style={copyBtnStyle('btc')}>{copied === 'btc' ? 'Copied!' : 'Copy'}</button>
          </div>
          <div style={{ background: '#000', padding: '10px', borderRadius: '8px', border: '1px solid #333', color: '#888', fontSize: '0.8em', wordBreak: 'break-all', fontFamily: 'monospace' }}>
            bc1q7e20apd7cmdhkurwtxee29298cqs4sc3aa6xf
          </div>
        </div>

        <div style={{ ...cardStyle, borderLeft: '4px solid #c084fc' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ color: '#c084fc', fontWeight: 'bold' }}>⚡ SOLANA (SOL)</span>
            <button onClick={() => handleCopy('DsKG8cEUyDydMQRBzenHFjpo9ZRvrRadmL4Nu2xAHBmS', 'sol')} style={copyBtnStyle('sol')}>{copied === 'sol' ? 'Copied!' : 'Copy'}</button>
          </div>
          <div style={{ background: '#000', padding: '10px', borderRadius: '8px', border: '1px solid #333', color: '#888', fontSize: '0.8em', wordBreak: 'break-all', fontFamily: 'monospace' }}>
            DsKG8cEUyDydMQRBzenHFjpo9ZRvrRadmL4Nu2xAHBmS
          </div>
        </div>

        <div style={{ marginTop: '20px', marginBottom: '50px' }}>
          <h4 style={{ color: '#00cc66', fontSize: '0.9em', fontWeight: 'bold', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🛡️ ENCRYPTED COMMS & CUSTOM BUILDS
          </h4>
          <p style={{ color: '#aaa', fontSize: '0.85em', margin: '0 0 15px 0', lineHeight: '1.4' }}>
            For custom builds without ads, contact the creator directly. To ensure secure communication, please encrypt your messages using the public PGP key below.
          </p>
          
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '15px', borderBottom: '1px dashed #333', marginBottom: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.5em' }}>✉️</span>
                <div>
                  <span style={{ color: '#888', fontSize: '0.75em', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>DNMX Darknet Mail</span>
                  <strong style={{ color: '#fff', fontSize: '1.0em' }}>xNoOnex@dnmx.cc</strong>
                </div>
              </div>
              <button onClick={() => handleCopy('xNoOnex@dnmx.cc', 'email')} style={copyBtnStyle('email')}>{copied === 'email' ? 'Copied!' : 'Copy'}</button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.5em' }}>🔑</span>
                <div>
                  <span style={{ color: '#888', fontSize: '0.75em', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>ECC CURVE25519</span>
                  <strong style={{ color: '#fff', fontSize: '1.0em' }}>PUBLIC PGP KEY</strong>
                </div>
              </div>
              <button onClick={() => handleCopy(pgpKey, 'pgp')} style={copyBtnStyle('pgp')}>{copied === 'pgp' ? 'Copied!' : 'Copy Key'}</button>
            </div>
            
            <div style={{ background: '#000', padding: '10px', borderRadius: '8px', border: '1px solid #333', color: '#888', fontSize: '0.8em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>
              -----BEGIN PGP PUBLIC KEY BLOCK----- ...
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
