import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LearningHub() {
  const navigate = useNavigate();

  return (
    <div className="view-wrapper" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#fff', fontSize: '1.2em' }}>Learning Center</h2>
      </header>
      
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ fontSize: '4em', marginBottom: '20px' }}>🧠</div>
        <h3 style={{ color: '#00ffff', marginBottom: '10px' }}>Knowledge Base Construction</h3>
        <p style={{ color: '#888', lineHeight: '1.5', maxWidth: '80%' }}>
          The old schematics archive has been purged. This module is a blank slate primed for your custom learning pathways and training materials.
        </p>
      </div>
    </div>
  );
}
