import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Browser } from '@capacitor/browser';

export default function SchoolHub() {
  const navigate = useNavigate();

  const categories = [
    { id: 'preschool', icon: '🖍️', title: 'Early Childhood', desc: 'Foundational literacy and early learning.', url: 'https://www.oercommons.org/browse/primary-level' },
    { id: 'highschool', icon: '🎒', title: 'K-12 & High School', desc: 'Standards-aligned OER and AP preparation.', url: 'https://openstax.org/k12' },
    { id: 'college', icon: '🎓', title: 'Undergraduate', desc: 'Peer-reviewed open textbooks for college subjects.', url: 'https://openstax.org/subjects' },
    { id: 'postgrad', icon: '🔬', title: 'Postgrad & Research', desc: 'Academic repositories and technical whitepapers.', url: 'https://arxiv.org/' },
  ];

  const openOER = async (url) => {
    try {
      await Browser.open({ url });
    } catch (e) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/schematics')}>Hub</button>
        <h2>Open Education Archive</h2>
      </header>

      <div className="calc-content" style={{ padding: '20px', overflowY: 'auto', height: '100%', paddingBottom: '120px' }}>
        <p style={{ color: '#aaa', marginBottom: '20px', lineHeight: '1.5' }}>
          Access completely free, openly licensed educational resources (OER) and public domain textbooks. Downloads are handled directly to your device.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              style={{ display: 'flex', alignItems: 'center', background: 'rgba(20, 20, 20, 0.8)', border: '1px solid #444', borderRadius: '12px', padding: '15px', textAlign: 'left', width: '100%', cursor: 'pointer' }}
              onClick={() => openOER(cat.url)}
            >
              <span style={{ fontSize: '32px', marginRight: '15px', filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))' }}>{cat.icon}</span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: '#fff', fontWeight: '900', fontSize: '1.1em', marginBottom: '4px' }}>{cat.title}</span>
                <span style={{ color: '#ccc', fontSize: '0.85em', lineHeight: '1.3' }}>{cat.desc}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
