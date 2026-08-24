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
dGF0aW9ucy5vcGVucGdwanMub3JneHzp1hYoVxOxNUE9LJrz3zrwpmiG17Ko
YPmuhXFPjq4CmwwWIQQhvhVSgQJzxZPxjVQ1vXF7UTzeJgAAo/AA/0dX+YzL
f14xTA+YmOZ4feXKKj6dDePVLSkNyzzhPqYFAQDy5OfN80zrbT5g+WY9rfhE
fgKvjHdzrmDg82zium5fCA==
=SFFM
-----END PGP PUBLIC KEY BLOCK-----`;

  const sectionHeaderStyle = { fontSize: '0.85em', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px', marginTop: '25px', fontWeight: 'bold' };
  const cardStyle = { background: '#111', borderRadius: '16px', padding: '20px', marginBottom: '15px', border: '1px solid #222' };
  const copyBtnStyle = { background: '#2a2a2a', color: '#ccc', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.85em' };
  const rowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
  const labelStyle = { color: '#888', fontSize: '0.75em', textTransform: 'uppercase', marginBottom: '4px' };
  const valueStyle = { color: '#fff', fontSize: '1.2em', fontFamily: 'monospace' };

  return (
    <div className="view-wrapper" style={{ background: '#000', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #111' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', color: '#fff', border: 'none', fontSize: '1.1em', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
           ← Settings
        </button>
        <button onClick={() => navigate('/')} style={{ background: 'transparent', border: 'none', fontSize: '1.5em' }}>🏠</button>
      </header>

      <div style={{ padding: '20px', flex: 1, overflowY: 'auto', paddingBottom: '95px' }}>
        
        <h2 style={{ color: '#fff', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>☕ Support the Creator</h2>
        
        {copied && <div style={{ background: '#00cc66', color: '#000', padding: '10px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold', marginBottom: '15px' }}>Copied {copied}!</div>}

        {/* --- INFO & DISCLAIMER --- */}
        <div style={{ color: '#ccc', fontSize: '0.9em', lineHeight: '1.5', marginBottom: '15px' }}>
          <strong>ℹ️ About Support Sovereign Tools:</strong> For any custom built apps or to support decentralized research and tech, donate or contact me at <strong>xNoOnex@dnmx.cc</strong>.
        </div>
        <div style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#f59e0b', padding: '12px', borderRadius: '8px', fontSize: '0.9em', marginBottom: '25px' }}>
          <strong>⚠️ Disclaimer:</strong> Thank you for supporting decentralized independence.
        </div>

        {/* --- FIAT & MOBILE PAY --- */}
        <div style={{ ...sectionHeaderStyle, color: '#00ffff' }}>FIAT & MOBILE PAY</div>
        <div style={cardStyle}>
          <div style={{ ...rowStyle, marginBottom: '25px' }}>
            <div>
              <div style={labelStyle}>CASH APP</div>
              <div style={valueStyle}>$xNoOnesSovereignx</div>
            </div>
            <button onClick={() => copyToClipboard('$xNoOnesSovereignx', 'Cash App')} style={copyBtnStyle}>Copy</button>
          </div>
          <div style={rowStyle}>
            <div>
              <div style={labelStyle}>PAYPAL</div>
              <div style={valueStyle}>@xNoOnex</div>
            </div>
            <button onClick={() => copyToClipboard('@xNoOnex', 'PayPal')} style={copyBtnStyle}>Copy</button>
          </div>
        </div>

        {/* --- CRYPTOCURRENCY --- */}
        <div style={{ ...sectionHeaderStyle, color: '#f59e0b' }}>CRYPTOCURRENCY (ENCRYPTED & SOVEREIGN)</div>
        
        <div style={cardStyle}>
          <div style={{ color: '#f59e0b', fontSize: '0.85em', fontWeight: 'bold', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
             🔒 MONERO (XMR) - PRIVATE
          </div>
          <div style={{ color: '#888', fontFamily: 'monospace', fontSize: '0.8em', wordBreak: 'break-all', background: '#000', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
            4Au1YdG77bHaRCMP6QtjYHDoBpWAUi9BeJm2HcAbu7NtQKWnB4CK7nL4NxDUMyGAML9aj61r2GQa9PrsHSiD1qcjeR
          </div>
          <button onClick={() => copyToClipboard('4Au1YdG77bHaRCMP6QtjYHDoBpWAUi9BeJm2HcAbu7NtQKWnB4CK7nL4NxDUMyGAML9aj61r2GQa9PrsHSiD1qcjeR', 'Monero Address')} style={{ width: '100%', ...copyBtnStyle }}>Copy Monero Address</button>
        </div>

        <div style={cardStyle}>
          <div style={{ color: '#f59e0b', fontSize: '0.85em', fontWeight: 'bold', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
             🪙 BITCOIN (BTC)
          </div>
          <div style={{ color: '#888', fontFamily: 'monospace', fontSize: '0.8em', wordBreak: 'break-all', background: '#000', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
            bc1q7e20apd7cmdhkurwtxee29298cqs4sc3aa6xf
          </div>
          <button onClick={() => copyToClipboard('bc1q7e20apd7cmdhkurwtxee29298cqs4sc3aa6xf', 'Bitcoin Address')} style={{ width: '100%', ...copyBtnStyle }}>Copy Bitcoin Address</button>
        </div>

        <div style={cardStyle}>
          <div style={{ color: '#a855f7', fontSize: '0.85em', fontWeight: 'bold', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
             ⚡ SOLANA (SOL)
          </div>
          <div style={{ color: '#888', fontFamily: 'monospace', fontSize: '0.8em', wordBreak: 'break-all', background: '#000', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
            DsKG8cEUyDydMQRBzenHFjpo9ZRvrRadmL4Nu2xAHBmS
          </div>
          <button onClick={() => copyToClipboard('DsKG8cEUyDydMQRBzenHFjpo9ZRvrRadmL4Nu2xAHBmS', 'Solana Address')} style={{ width: '100%', ...copyBtnStyle }}>Copy Solana Address</button>
        </div>

        {/* --- PGP KEY SECTION --- */}
        <div style={{ ...sectionHeaderStyle, color: '#00cc66', display: 'flex', alignItems: 'center', gap: '8px' }}>
           🛡️ ENCRYPTED COMMS (PGP)
        </div>
        
        <div style={cardStyle}>
          <div style={rowStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ fontSize: '2em' }}>✉️</div>
              <div>
                <div style={labelStyle}>DNMX DARKNET MAIL</div>
                <div style={valueStyle}>xNoOnex@dnmx.cc</div>
              </div>
            </div>
            <button onClick={() => copyToClipboard('xNoOnex@dnmx.cc', 'Email')} style={copyBtnStyle}>Copy</button>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ ...rowStyle, marginBottom: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ fontSize: '2em' }}>🔑</div>
              <div>
                <div style={labelStyle}>ECC CURVE25519</div>
                <div style={{ color: '#fff', fontSize: '1em', fontWeight: 'bold' }}>PUBLIC PGP KEY</div>
              </div>
            </div>
            <button onClick={() => copyToClipboard(pgpKey, 'PGP Key')} style={{ ...copyBtnStyle, color: '#00cc66', background: 'rgba(0, 204, 102, 0.1)', border: '1px solid #00cc66' }}>Copy Key</button>
          </div>
          
          <div style={{ background: '#000', padding: '15px', borderRadius: '8px', overflowX: 'auto', whiteSpace: 'nowrap', color: '#666', fontFamily: 'monospace', fontSize: '0.75em' }}>
             {pgpKey.replace(/\n/g, ' ')}
          </div>
        </div>

      </div>
    </div>
  );
}
