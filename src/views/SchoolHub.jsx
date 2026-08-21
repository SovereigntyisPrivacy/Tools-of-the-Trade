import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Browser } from '@capacitor/browser';

export default function SchoolHub() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSubcategory, setActiveSubcategory] = useState('All');

  const categories = ['All', 'STEM', 'Humanities', 'Medical', 'Trades'];

  const subcategories = {
    'STEM': ['All', 'Mathematics', 'Computer Science', 'Physics', 'Engineering'],
    'Humanities': ['All', 'Literature', 'History', 'Philosophy', 'Law'],
    'Medical': ['All', 'Anatomy', 'Nursing', 'Pharmacology', 'Emergency Med'],
    'Trades': ['All', 'Automotive', 'Electrical', 'Welding', 'Construction']
  };

  // The Ultimate Master Directory
  const portals = [
    // STEM
    { id: 'math-openstax', category: 'STEM', subcategory: 'Mathematics', title: 'OpenStax Mathematics', desc: 'Calculus, Algebra, Statistics, and Geometry.', url: 'https://openstax.org/subjects/math', icon: '📐' },
    { id: 'cs-freecodecamp', category: 'STEM', subcategory: 'Computer Science', title: 'freeCodeCamp', desc: 'Completely free interactive coding certifications for Python, JS, and databases.', url: 'https://www.freecodecamp.org/', icon: '💻' },
    { id: 'phys-mit', category: 'STEM', subcategory: 'Physics', title: 'MIT OpenCourseWare Physics', desc: 'Direct lecture notes and exams from MIT physics courses.', url: 'https://ocw.mit.edu/search/?d=Physics', icon: '⚛️' },
    { id: 'eng-libre', category: 'STEM', subcategory: 'Engineering', title: 'LibreTexts Engineering', desc: 'Aerospace, civil, electrical, and mechanical engineering texts.', url: 'https://eng.libretexts.org/', icon: '🏗️' },
    
    // Humanities
    { id: 'lit-gutenberg', category: 'Humanities', subcategory: 'Literature', title: 'Project Gutenberg', desc: 'Library of over 70,000 free public domain eBooks and classics.', url: 'https://www.gutenberg.org/', icon: '📖' },
    { id: 'hist-oer', category: 'Humanities', subcategory: 'History', title: 'OER Commons History', desc: 'World history, primary source documents, and historical analyses.', url: 'https://www.oercommons.org/browse/subject/history', icon: '🏛️' },
    
    // Medical
    { id: 'med-anat', category: 'Medical', subcategory: 'Anatomy', title: 'OpenStax Anatomy', desc: 'Detailed biological systems and human anatomy models.', url: 'https://openstax.org/details/books/anatomy-and-physiology-2e', icon: '🧬' },
    { id: 'med-rn', category: 'Medical', subcategory: 'Nursing', title: 'Open RN', desc: 'Open-access nursing textbooks covering pharmacology and clinical skills.', url: 'https://www.openrnproject.org/', icon: '⚕️' },
    
    // Trades (Vocational)
    { id: 'trade-skills', category: 'Trades', subcategory: 'All', title: 'SkillsCommons', desc: 'The massive open library of workforce training materials and trade manuals.', url: 'https://www.skillscommons.org/', icon: '🧰' },
    { id: 'trade-auto', category: 'Trades', subcategory: 'Automotive', title: 'Motor Age Training', desc: 'Open ASE certification study guides and automotive repair fundamentals.', url: 'https://support.motoragetraining.com/', icon: '🚗' },
    { id: 'trade-elec', category: 'Trades', subcategory: 'Electrical', title: 'AllAboutCircuits', desc: 'Free online textbooks covering DC/AC circuits and semiconductors.', url: 'https://www.allaboutcircuits.com/textbook/', icon: '⚡' }
  ];

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setActiveSubcategory('All'); // Reset sub filter when main filter changes
  };

  const filteredPortals = portals.filter(portal => {
    const matchesCategory = activeCategory === 'All' || portal.category === activeCategory;
    const matchesSub = activeSubcategory === 'All' || portal.subcategory === activeSubcategory || portal.subcategory === 'All';
    const matchesSearch = portal.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          portal.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSub && matchesSearch;
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
        <h2>The Study Engine</h2>
      </header>

      <div className="calc-content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        
        {/* Dynamic Filtering Section */}
        <div style={{ padding: '20px 20px 10px 20px', background: '#000', borderBottom: '1px solid #333' }}>
          <input
            type="text"
            placeholder="Search all subjects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #00ffff', background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '1.1em', marginBottom: '15px' }}
          />

          {/* Primary Categories */}
          <div style={{ display: 'flex', overflowX: 'auto', gap: '10px', paddingBottom: '10px', scrollbarWidth: 'none', borderBottom: activeCategory !== 'All' ? '1px dashed #444' : 'none' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
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

          {/* Secondary Subcategories (Dynamic) */}
          {activeCategory !== 'All' && subcategories[activeCategory] && (
            <div style={{ display: 'flex', overflowX: 'auto', gap: '8px', paddingTop: '10px', paddingBottom: '5px', scrollbarWidth: 'none' }}>
              {subcategories[activeCategory].map(sub => (
                <button
                  key={sub}
                  onClick={() => setActiveSubcategory(sub)}
                  style={{
                    padding: '6px 12px', borderRadius: '8px', whiteSpace: 'nowrap', fontSize: '0.9em',
                    background: activeSubcategory === sub ? '#00cc66' : 'transparent',
                    color: activeSubcategory === sub ? '#000' : '#888',
                    border: activeSubcategory === sub ? 'none' : '1px solid #444',
                  }}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Database Results */}
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
                        {portal.category} ❯ {portal.subcategory}
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: '15px' }}>
                    <p style={{ color: '#aaa', fontSize: '0.9em', margin: '0 0 15px 0', lineHeight: '1.4' }}>{portal.desc}</p>
                    <button 
                      onClick={() => openPortal(portal.url)} 
                      style={{ width: '100%', padding: '12px', background: 'rgba(0, 255, 255, 0.1)', color: '#00ffff', border: '1px solid #00ffff', borderRadius: '8px', fontWeight: 'bold' }}
                    >
                      ↗ Access Database
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: '#aaa', textAlign: 'center', marginTop: '40px' }}>
                No resources found.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
