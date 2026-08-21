import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Browser } from '@capacitor/browser';

export default function SchoolHub() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // The Categories for our Filter Bar
  const categories = ['All', 'Math', 'Science', 'Technology', 'Engineering', 'Humanities', 'Medical'];

  // The Master Database: Notice the new 'category' tag on each object
  const subjects = [
    // Math
    { id: 'math-calc1', category: 'Math', title: 'Calculus Vol. 1', desc: 'Direct PDF (35MB). Derivatives, integrals, and limits.', source: 'OpenStax', url: 'https://assets.openstax.org/oscms-prodcms/media/documents/CalculusVolume1-WEB.pdf', icon: '📐' },
    { id: 'math-alg', category: 'Math', title: 'College Algebra', desc: 'Direct PDF (40MB). Equations, inequalities, and functions.', source: 'OpenStax', url: 'https://assets.openstax.org/oscms-prodcms/media/documents/CollegeAlgebra-WEB.pdf', icon: '➗' },
    
    // Science
    { id: 'sci-phys1', category: 'Science', title: 'University Physics Vol. 1', desc: 'Direct PDF (48MB). Mechanics, sound, and thermodynamics.', source: 'OpenStax', url: 'https://assets.openstax.org/oscms-prodcms/media/documents/UniversityPhysicsVolume1-WEB.pdf', icon: '⚛️' },
    { id: 'sci-chem', category: 'Science', title: 'Chemistry 2e', desc: 'Direct PDF (55MB). Atomic structure, thermodynamics, and equilibrium.', source: 'OpenStax', url: 'https://assets.openstax.org/oscms-prodcms/media/documents/Chemistry2e-WEB.pdf', icon: '🧪' },
    
    // Technology
    { id: 'tech-py', category: 'Technology', title: 'Think Python 2e', desc: 'Direct PDF (2MB). Introduction to software design and programming.', source: 'Green Tea Press', url: 'https://greenteapress.com/thinkpython2/thinkpython2.pdf', icon: '💻' },
    
    // Medical
    { id: 'med-anat', category: 'Medical', title: 'Anatomy & Physiology', desc: 'Direct PDF (115MB). Biological systems and human anatomy.', source: 'OpenStax', url: 'https://assets.openstax.org/oscms-prodcms/media/documents/AnatomyandPhysiology-WEB.pdf', icon: '🧬' },
    
    // Humanities
    { id: 'hum-ushist', category: 'Humanities', title: 'U.S. History', desc: 'Direct PDF (85MB). Pre-Columbian to modern eras.', source: 'OpenStax', url: 'https://assets.openstax.org/oscms-prodcms/media/documents/USHistory-WEB.pdf', icon: '📜' }
  ];

  // The Filter Engine
  const filteredSubjects = subjects.filter(sub => {
    const matchesCategory = activeCategory === 'All' || sub.category === activeCategory;
    const matchesSearch = sub.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          sub.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const downloadToDevice = async (url) => {
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
        <h2>School & OER Database</h2>
      </header>

      <div className="calc-content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        
        {/* Fixed Top Section: Search & Filters */}
        <div style={{ padding: '20px 20px 10px 20px', background: '#000', borderBottom: '1px solid #333' }}>
          <input
            type="text"
            placeholder="Search library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #00ffff', background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '1.1em', marginBottom: '15px' }}
          />

          {/* Horizontal Scrolling Category Bar */}
          <div style={{ display: 'flex', overflowX: 'auto', gap: '10px', paddingBottom: '10px', scrollbarWidth: 'none' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  whiteSpace: 'nowrap',
                  fontWeight: 'bold',
                  background: activeCategory === cat ? '#00ffff' : '#222',
                  color: activeCategory === cat ? '#000' : '#aaa',
                  border: activeCategory === cat ? 'none' : '1px solid #444',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Results Section */}
        <div style={{ padding: '20px', overflowY: 'auto', paddingBottom: '120px', flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {filteredSubjects.length > 0 ? (
              filteredSubjects.map(sub => (
                <div key={sub.id} style={{ background: '#111', borderRadius: '12px', overflow: 'hidden', border: '1px solid #333' }}>
                  <div style={{ display: 'flex', borderBottom: '1px solid #444' }}>
                    <div style={{ width: '80px', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '35px' }}>
                      {sub.icon}
                    </div>
                    <div style={{ padding: '12px', flex: 1 }}>
                      <h4 style={{ color: '#fff', margin: '0 0 4px 0', fontSize: '1.1em' }}>{sub.title}</h4>
                      <span style={{ color: '#00ffff', fontSize: '0.75em', background: 'rgba(0, 255, 255, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                        {sub.category} | {sub.source}
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: '15px' }}>
                    <p style={{ color: '#aaa', fontSize: '0.9em', margin: '0 0 15px 0', lineHeight: '1.4' }}>{sub.desc}</p>
                    <button 
                      onClick={() => downloadToDevice(sub.url)} 
                      style={{ width: '100%', padding: '12px', background: 'rgba(0, 204, 102, 0.1)', color: '#00cc66', border: '1px solid #00cc66', borderRadius: '8px', fontWeight: 'bold' }}
                    >
                      ↓ Download Archive
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: '#aaa', textAlign: 'center', marginTop: '40px' }}>
                No records found in {activeCategory} matching "{searchQuery}".
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
