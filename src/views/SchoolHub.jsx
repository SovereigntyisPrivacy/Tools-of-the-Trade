import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Browser } from '@capacitor/browser';

export default function SchoolHub() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Curated database with DIRECT .pdf download links
  const subjects = [
    { id: 'math-calc', title: 'Calculus Vol. 1', desc: 'Direct PDF Download (35MB). Covers derivatives, integrals, and limits.', source: 'OpenStax', url: 'https://assets.openstax.org/oscms-prodcms/media/documents/CalculusVolume1-WEB.pdf', icon: '📐' },
    { id: 'sci-physics', title: 'University Physics Vol. 1', desc: 'Direct PDF Download (48MB). Mechanics, sound, and thermodynamics.', source: 'OpenStax', url: 'https://assets.openstax.org/oscms-prodcms/media/documents/UniversityPhysicsVolume1-WEB.pdf', icon: '⚛️' },
    { id: 'cs-python', title: 'Think Python 2e', desc: 'Direct PDF Download (2MB). Introduction to software design and programming.', source: 'Green Tea Press', url: 'https://greenteapress.com/thinkpython2/thinkpython2.pdf', icon: '💻' },
    { id: 'med-anatomy', title: 'Anatomy & Physiology', desc: 'Direct PDF Download (115MB). Biological systems and human anatomy.', source: 'OpenStax', url: 'https://assets.openstax.org/oscms-prodcms/media/documents/AnatomyandPhysiology-WEB.pdf', icon: '🧬' }
  ];

  const filteredSubjects = subjects.filter(sub => 
    sub.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    sub.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const downloadToDevice = async (url) => {
    try {
      // This hands the direct PDF link to the OS, triggering a native background download
      await Browser.open({ url });
    } catch (e) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/schematics')}>Hub</button>
        <h2>School & OER Database</h2>
      </header>

      <div className="calc-content" style={{ padding: '20px', overflowY: 'auto', height: '100%', paddingBottom: '120px' }}>
        
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search direct PDF archives..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #00ffff', background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '1.1em' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredSubjects.length > 0 ? (
            filteredSubjects.map(sub => (
              <div key={sub.id} style={{ background: '#111', borderRadius: '12px', overflow: 'hidden', border: '1px solid #333' }}>
                <div style={{ height: '100px', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '45px', borderBottom: '1px solid #444' }}>
                  {sub.icon}
                </div>
                <div style={{ padding: '15px' }}>
                  <h4 style={{ color: '#fff', margin: '0 0 8px 0', fontSize: '1.2em' }}>{sub.title}</h4>
                  <p style={{ color: '#aaa', fontSize: '0.9em', margin: '0 0 15px 0', lineHeight: '1.4' }}>{sub.desc}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <span style={{ color: '#00ffff', fontSize: '0.8em', background: 'rgba(0, 255, 255, 0.1)', padding: '4px 8px', borderRadius: '4px' }}>
                      Source: {sub.source}
                    </span>
                  </div>

                  <button 
                    onClick={() => downloadToDevice(sub.url)} 
                    style={{ width: '100%', padding: '12px', background: 'rgba(0, 204, 102, 0.1)', color: '#00cc66', border: '1px solid #00cc66', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em' }}
                  >
                    ↓ Download to Device
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ color: '#aaa', textAlign: 'center', marginTop: '40px' }}>
              No subjects found matching "{searchQuery}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
