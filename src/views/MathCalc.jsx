import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function MathCalc() {
  const navigate = useNavigate();
  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/calculator')}>Hub</button>
        <h2>🧮 Basic Math</h2>
      </header>
      <div className="calc-content" style={{ padding: '20px', color: '#fff', textAlign: 'center', marginTop: '40px' }}>
        <p style={{ color: '#aaa', fontSize: '1.1em' }}>Standard calculator interface standing by for integration.</p>
      </div>
    </div>
  );
}
