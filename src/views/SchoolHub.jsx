import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Browser } from '@capacitor/browser';

export default function SchoolHub() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Textbooks', 'Literature', 'Courseware', 'Research'];

  // Master Directory of Official OER Portals
  const portals = [
    { id: 'openstax', category: 'Textbooks', title: 'OpenStax Library', desc: 'Peer-reviewed, fully licensed K-12 and College textbooks (Math, Science, Humanities).', url: 'https://openstax.org/subjects', icon: '📚' },
    { id: 'libretexts', category: 'Textbooks', title: 'LibreTexts', desc: 'Massive multi-institutional open textbook project covering 13 academic disciplines.', url: 'https://libretexts.org/', icon: '🌐' },
    { id: 'gutenberg', category: 'Literature', title: 'Project Gutenberg', desc: 'Library of over 70,000 free public domain eBooks, classics, and historical texts.', url: 'https://www.gutenberg.org/', icon: '📖' },
    { id: 'mit-ocw', category: 'Courseware', title: 'MIT OpenCourseWare', desc: 'Free lecture notes, exams, and videos from actual Massachusetts Institute of Technology courses.', url: 'https://ocw.mit.edu/', icon: '🏛️' },
    { id: 'core', category: 'Research', title: 'CORE Research', desc: 'The world’s largest collection of open-access research papers and technical journals.', url: 'https://core.ac.uk/', icon: '🔬' },
    { id: 'archive', category: 'Literature', title: 'Internet Archive', desc: 'Non-profit library of millions of free books, movies, software, and websites.', url: 'https://archive.org/', icon: '🏛️' }
  ];

  const filteredPortals = portals.filter(portal => {
    const matchesCategory = activeCategory === 'All' || portal.category === activeCategory;
    const matchesSearch = portal.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          portal.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openPortal = async (url) => {
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
        <h2>Open Education Portals</h2>
      </header>

      <div className="calc-content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        
        <div style={{ padding: '20px 20px 10px 20px', background: '#000', borderBottom: '1px solid #333' }}>
          <input
            type="text"
            placeholder="Search official portals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #00ffff', background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '1.1em', marginBottom: '15px' }}
          />

          <div style={{ display: 'flex', overflowX: 'auto', gap: '10px', paddingBottom: '10px', scrollbarWidth: 'none' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '8px 16px', borderRadius: '20px', whiteSpace: 'nowrap', fontWeight: 'bold',
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

        <div style={{ padding: '20px', overflowY: 'auto', paddingBottom: '120px', flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {filteredPortals.length > 0 ? (
              filteredPortals.map(portal => (
                <div key={portal.id} style={{ background: '#111', borderRadius: '12px', overflow: 'hidden', border: '1px solid #333' }}>
                  <div style={{ display: 'flex', borderBottom: '1px solid #444' }}>
                    <div style={{ width: '80px', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '35px' }}>
                      {portal.icon}
                    </div>
                    <div style={{ padding: '12px', flex: 1 }}>
                      <h4 style={{ color: '#fff', margin: '0 0 4px 0', fontSize: '1.1em' }}>{portal.title}</h4>
                      <span style={{ color: '#00ffff', fontSize: '0.75em', background: 'rgba(0, 255, 255, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                        {portal.category}
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: '15px' }}>
                    <p style={{ color: '#aaa', fontSize: '0.9em', margin: '0 0 15px 0', lineHeight: '1.4' }}>{portal.desc}</p>
                    <button 
                      onClick={() => openPortal(portal.url)} 
                      style={{ width: '100%', padding: '12px', background: 'rgba(0, 255, 255, 0.1)', color: '#00ffff', border: '1px solid #00ffff', borderRadius: '8px', fontWeight: 'bold' }}
                    >
                      ↗ Access Official Portal
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: '#aaa', textAlign: 'center', marginTop: '40px' }}>
                No portals found in {activeCategory}.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
