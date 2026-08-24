import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SOPEngine() {
  const navigate = useNavigate();

  const [sops, setSops] = useState(() => {
    const saved = localStorage.getItem('fleet_sops');
    return saved ? JSON.parse(saved) : [];
  });

  const [expanded, setExpanded] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTasks, setNewTasks] = useState('');

  useEffect(() => { localStorage.setItem('fleet_sops', JSON.stringify(sops)); }, [sops]);

  const handleAddSOP = () => {
    if (!newTitle || !newTasks) return;
    const taskList = newTasks.split('\n').filter(t => t.trim() !== '').map(t => ({ text: t.trim(), done: false }));
    const newId = `sop_${Date.now()}`;
    setSops([...sops, { id: newId, title: newTitle, tasks: taskList }]);
    // Auto-expand newly created SOPs
    setExpanded({ ...expanded, [newId]: true });
    setShowModal(false); setNewTitle(''); setNewTasks('');
  };

  const toggleTask = (sopId, taskIdx) => {
    setSops(sops.map(s => {
      if (s.id !== sopId) return s;
      const updatedTasks = [...s.tasks];
      updatedTasks[taskIdx].done = !updatedTasks[taskIdx].done;
      return { ...s, tasks: updatedTasks };
    }));
  };

  const resetSOP = (sopId) => setSops(sops.map(s => s.id === sopId ? { ...s, tasks: s.tasks.map(t => ({...t, done: false})) } : s));
  const deleteSOP = (sopId) => setSops(sops.filter(s => s.id !== sopId));
  const toggleExpand = (sopId) => setExpanded({ ...expanded, [sopId]: !expanded[sopId] });

  // --- COLOR SYNTAX PARSER ---
  const parseColor = (text) => {
    if (text.startsWith('[R] ')) return { color: '#ef4444', text: text.substring(4) };
    if (text.startsWith('[Y] ')) return { color: '#f59e0b', text: text.substring(4) };
    if (text.startsWith('[G] ')) return { color: '#00cc66', text: text.substring(4) };
    if (text.startsWith('[B] ')) return { color: '#3b82f6', text: text.substring(4) };
    return { color: '#fff', text: text };
  };

  const inputStyle = { width: '100%', padding: '12px', background: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff', marginBottom: '10px' };
  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };

  return (
    <div className="view-wrapper" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#fff', fontSize: '1.2em' }}>SOP Engine</h2>
      </header>

      <div style={{ padding: '15px', flex: 1, overflowY: 'auto', paddingBottom: '95px' }}>
        <button onClick={() => setShowModal(true)} style={{ width: '100%', background: '#3b82f6', color: '#fff', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', marginBottom: '20px' }}>+ Build New Procedure</button>

        {sops.map(sop => {
          const progress = sop.tasks.length === 0 ? 0 : (sop.tasks.filter(t => t.done).length / sop.tasks.length) * 100;
          const isExpanded = expanded[sop.id];

          return (
            <div key={sop.id} style={{ ...cardStyle, borderTop: `4px solid ${progress === 100 ? '#00cc66' : '#3b82f6'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div onClick={() => toggleExpand(sop.id)} style={{ flex: 1, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h3 style={{ margin: 0, color: '#fff' }}>{sop.title}</h3>
                  <span style={{ color: '#555', fontSize: '1.2em' }}>{isExpanded ? '▲' : '▼'}</span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => resetSOP(sop.id)} style={{ background: '#222', color: '#00ffff', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '0.8em' }}>Reset</button>
                    <button onClick={() => deleteSOP(sop.id)} style={{ background: 'transparent', color: '#ef4444', border: 'none', fontSize: '1.2em' }}>×</button>
                </div>
              </div>

              {/* Progress bar stays visible even when collapsed */}
              <div style={{ background: '#222', height: '6px', borderRadius: '3px', marginBottom: isExpanded ? '15px' : '0', overflow: 'hidden' }}>
                <div style={{ background: progress === 100 ? '#00cc66' : '#3b82f6', height: '100%', width: `${progress}%`, transition: 'width 0.3s ease' }} />
              </div>

              {isExpanded && sop.tasks.map((task, i) => {
                const parsed = parseColor(task.text);
                return (
                  <div key={i} onClick={() => toggleTask(sop.id, i)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: '1px solid #222', cursor: 'pointer' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '4px', border: `2px solid ${task.done ? '#00cc66' : '#555'}`, background: task.done ? '#00cc66' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', flexShrink: 0 }}>
                        {task.done && '✓'}
                    </div>
                    <div style={{ color: task.done ? '#555' : parsed.color, textDecoration: task.done ? 'line-through' : 'none', flex: 1, fontWeight: parsed.color !== '#fff' && !task.done ? 'bold' : 'normal' }}>
                        {parsed.text}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {showModal && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', zIndex: 100, display: 'flex', flexDirection: 'column', padding: '20px' }}>
          <h2 style={{ color: '#fff', marginTop: 0 }}>New Procedure</h2>
          <input type="text" placeholder="E.g. Closing Duties" value={newTitle} onChange={e=>setNewTitle(e.target.value)} style={inputStyle} />
          
          <div style={{ color: '#aaa', fontSize: '0.85em', marginBottom: '10px', lineHeight: '1.4' }}>
            <strong>Color Codes:</strong> Prefix lines with 
            <span style={{color:'#ef4444', fontWeight:'bold'}}> [R] </span> for Red, 
            <span style={{color:'#f59e0b', fontWeight:'bold'}}> [Y] </span> for Yellow, 
            <span style={{color:'#00cc66', fontWeight:'bold'}}> [G] </span> for Green, or 
            <span style={{color:'#3b82f6', fontWeight:'bold'}}> [B] </span> for Blue.
          </div>
          
          <textarea placeholder="[R] Lock the front doors&#10;[Y] Count the register&#10;[G] Clock out" value={newTasks} onChange={e=>setNewTasks(e.target.value)} style={{ ...inputStyle, flex: 1, resize: 'none', fontFamily: 'monospace' }} />
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '15px', background: '#222', color: '#fff', border: 'none', borderRadius: '8px' }}>Cancel</button>
            <button onClick={handleAddSOP} style={{ flex: 1, padding: '15px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Save SOP</button>
          </div>
        </div>
      )}
    </div>
  );
}
