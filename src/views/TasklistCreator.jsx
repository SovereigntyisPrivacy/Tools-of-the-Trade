import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TasklistCreator() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Active');

  // --- STORAGE ---
  const [sops, setSops] = useState(() => JSON.parse(localStorage.getItem('fleet_sops')) || []);
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('fleet_sops_history')) || []);
  const [expanded, setExpanded] = useState({});

  // --- BUILDER MODAL ---
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [draftTasks, setDraftTasks] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [taskColor, setTaskColor] = useState('#ffffff');

  // --- ACTION MODALS ---
  const [scheduleModal, setScheduleModal] = useState(null);
  const [scheduleDate, setScheduleDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [archiveModal, setArchiveModal] = useState(null);
  const [proofImage, setProofImage] = useState(null);

  useEffect(() => {
    localStorage.setItem('fleet_sops', JSON.stringify(sops));
    localStorage.setItem('fleet_sops_history', JSON.stringify(history));
  }, [sops, history]);

  const toggleTask = (sopId, taskIdx) => {
    setSops(sops.map(s => {
      if (s.id !== sopId) return s;
      const updatedTasks = [...s.tasks];
      updatedTasks[taskIdx].done = !updatedTasks[taskIdx].done;
      return { ...s, tasks: updatedTasks };
    }));
  };

  const executeSchedule = () => {
    setSops(sops.map(s => s.id === scheduleModal ? { ...s, scheduledDate: scheduleDate } : s));
    setScheduleModal(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        let w = img.width; let h = img.height;
        const MAX = 600; // Heavy offline compression
        if (w > h && w > MAX) { h *= MAX / w; w = MAX; } else if (h > MAX) { w *= MAX / h; h = MAX; }
        canvas.width = w; canvas.height = h;
        ctx.drawImage(img, 0, 0, w, h);
        setProofImage(canvas.toDataURL('image/jpeg', 0.6));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const confirmArchive = () => {
    const targetSOP = sops.find(s => s.id === archiveModal);
    const now = new Date();
    const record = {
      id: `hist_${Date.now()}`,
      title: targetSOP.title,
      date: `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`,
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      image: proofImage,
      tasksDone: targetSOP.tasks.filter(t => t.done).length,
      tasksTotal: targetSOP.tasks.length
    };
    
    setHistory([record, ...history]);
    // Reset active SOP for future use
    setSops(sops.map(s => s.id === archiveModal ? { ...s, scheduledDate: null, tasks: s.tasks.map(t => ({...t, done: false})) } : s));
    setArchiveModal(null);
    setProofImage(null);
  };

  const handleSaveSOP = () => {
    if (!newTitle || draftTasks.length === 0) return;
    setSops([...sops, { id: `sop_${Date.now()}`, title: newTitle, tasks: draftTasks, scheduledDate: null }]);
    setShowModal(false); setNewTitle(''); setDraftTasks([]);
  };

  const inputStyle = { width: '100%', padding: '12px', background: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff', marginBottom: '10px' };
  const cardStyle = { background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };

  return (
    <div className="view-wrapper" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#3b82f6', fontSize: '1.2em' }}>Tasklist Creator</h2>
      </header>

      <div style={{ display: 'flex', padding: '15px', gap: '10px' }}>
        <button onClick={() => setActiveTab('Active')} style={{ flex: 1, padding: '10px', borderRadius: '8px', fontWeight: 'bold', border: 'none', background: activeTab === 'Active' ? '#3b82f6' : '#222', color: activeTab === 'Active' ? '#fff' : '#888' }}>Active Lists</button>
        <button onClick={() => setActiveTab('History')} style={{ flex: 1, padding: '10px', borderRadius: '8px', fontWeight: 'bold', border: 'none', background: activeTab === 'History' ? '#00cc66' : '#222', color: activeTab === 'History' ? '#000' : '#888' }}>History Log</button>
      </div>

      <div style={{ padding: '0 15px 100px 15px', flex: 1, overflowY: 'auto' }}>
        
        {activeTab === 'Active' && (
          <>
            <button onClick={() => setShowModal(true)} style={{ width: '100%', background: '#3b82f6', color: '#fff', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', marginBottom: '20px' }}>
              + Build New Tasklist
            </button>

            {sops.map(sop => {
              const progress = sop.tasks.length === 0 ? 0 : (sop.tasks.filter(t => t.done).length / sop.tasks.length) * 100;
              const isExpanded = expanded[sop.id];
              const progColor = progress === 100 ? '#00cc66' : (progress > 0 ? '#a855f7' : '#ef4444');

              return (
                <div key={sop.id} style={{ ...cardStyle, borderTop: `4px solid ${progColor}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div onClick={() => setExpanded({ ...expanded, [sop.id]: !isExpanded })} style={{ flex: 1, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h3 style={{ margin: 0, color: '#fff', fontSize: '1.2em' }}>{sop.title}</h3>
                      <span style={{ color: '#555', fontSize: '1.2em' }}>{isExpanded ? '▲' : '▼'}</span>
                    </div>
                    <button onClick={() => setSops(sops.map(s => s.id === sop.id ? {...s, tasks: s.tasks.map(t => ({...t, done:false}))} : s))} style={{ background: '#222', color: '#fff', border: '1px solid #333', padding: '6px 10px', borderRadius: '6px', fontSize: '0.8em' }}>Reset</button>
                    <button onClick={() => setSops(sops.filter(s => s.id !== sop.id))} style={{ background: 'transparent', color: '#ef4444', border: 'none', fontSize: '1.2em', marginLeft: '5px' }}>x</button>
                  </div>
                  
                  <div style={{ background: '#222', height: '6px', borderRadius: '3px', marginBottom: isExpanded ? '15px' : '0', overflow: 'hidden' }}>
                    <div style={{ background: progColor, height: '100%', width: `${progress}%`, transition: 'width 0.3s ease' }} />
                  </div>

                  {isExpanded && (
                    <>
                      {sop.tasks.map((task, i) => (
                        <div key={i} onClick={() => toggleTask(sop.id, i)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: '1px solid #222', cursor: 'pointer' }}>
                          <div style={{ width: '24px', height: '24px', borderRadius: '4px', border: `2px solid ${task.done ? '#00cc66' : '#555'}`, background: task.done ? '#00cc66' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', flexShrink: 0 }}>
                            {task.done && '✓'}
                          </div>
                          <div style={{ color: task.done ? '#555' : task.color, textDecoration: task.done ? 'line-through' : 'none', flex: 1, fontWeight: task.color !== '#ffffff' && !task.done ? 'bold' : 'normal' }}>
                            {task.text}
                          </div>
                        </div>
                      ))}
                      
                      <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                        <button onClick={() => setScheduleModal(sop.id)} style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px dashed #a855f7', color: '#a855f7', borderRadius: '8px', fontWeight: 'bold' }}>
                          {sop.scheduledDate ? `📅 Synced: ${sop.scheduledDate}` : '📅 Sync to Calendar'}
                        </button>
                        <button onClick={() => setArchiveModal(sop.id)} style={{ flex: 1, padding: '10px', background: '#00cc66', border: 'none', color: '#000', borderRadius: '8px', fontWeight: 'bold' }}>
                          ✅ Complete & Log
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </>
        )}

        {activeTab === 'History' && (
          <div>
            {history.length === 0 ? <p style={{ color: '#555', textAlign: 'center', fontStyle: 'italic' }}>No tasklists completed yet.</p> : 
              history.map(hist => (
                <div key={hist.id} style={{ ...cardStyle, position: 'relative' }}>
                  <button onClick={() => setHistory(history.filter(h => h.id !== hist.id))} style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', color: '#ef4444', fontWeight: 'bold', fontSize: '1.2em' }}>x</button>
                  <h3 style={{ margin: '0 0 5px 0', color: '#00cc66' }}>{hist.title}</h3>
                  <p style={{ margin: '0 0 10px 0', color: '#888', fontSize: '0.85em' }}>{hist.date} at {hist.time} • {hist.tasksDone}/{hist.tasksTotal} Tasks Completed</p>
                  {hist.image && <img src={hist.image} alt="Proof" style={{ width: '100%', borderRadius: '8px', border: '1px solid #333' }} />}
                </div>
              ))
            }
          </div>
        )}
      </div>

      {/* --- BUILDER MODAL --- */}
      {showModal && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', zIndex: 100, display: 'flex', flexDirection: 'column', padding: '20px' }}>
          <h2 style={{ color: '#fff', marginTop: 0 }}>New Tasklist</h2>
          <input type="text" placeholder="List Title (e.g. Closing Duties)" value={newTitle} onChange={e => setNewTitle(e.target.value)} style={inputStyle} />
          
          <div style={{ background: '#111', padding: '15px', borderRadius: '8px', border: '1px solid #333', marginBottom: '15px' }}>
            <p style={{ color: '#aaa', margin: '0 0 10px 0', fontSize: '0.85em' }}>Add Tasks:</p>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              {['#ffffff', '#ef4444', '#f59e0b', '#00cc66', '#3b82f6'].map(c => (
                <div key={c} onClick={() => setTaskColor(c)} style={{ width: '30px', height: '30px', borderRadius: '50%', background: c, border: taskColor === c ? '3px solid #fff' : '1px solid #333', cursor: 'pointer' }} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input type="text" placeholder="Task description..." value={taskText} onChange={e => setTaskText(e.target.value)} style={{ ...inputStyle, marginBottom: 0, color: taskColor }} />
              <button onClick={() => { if(taskText) { setDraftTasks([...draftTasks, {text: taskText, color: taskColor, done: false}]); setTaskText(''); } }} style={{ padding: '0 15px', background: '#333', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Add</button>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', marginBottom: '15px' }}>
            {draftTasks.map((t, i) => (
              <div key={i} style={{ padding: '10px', background: '#000', borderBottom: '1px solid #222', color: t.color }}>• {t.text}</div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '15px', background: '#222', color: '#fff', border: 'none', borderRadius: '8px' }}>Cancel</button>
            <button onClick={handleSaveSOP} style={{ flex: 1, padding: '15px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Save List</button>
          </div>
        </div>
      )}

      {/* --- SCHEDULE MODAL --- */}
      {scheduleModal && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', zIndex: 100, display: 'flex', flexDirection: 'column', padding: '20px', justifyContent: 'center' }}>
          <h2 style={{ color: '#fff', textAlign: 'center' }}>Live-Link to Calendar</h2>
          <input type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} style={inputStyle} />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setScheduleModal(null)} style={{ flex: 1, padding: '15px', background: '#222', color: '#fff', border: 'none', borderRadius: '8px' }}>Cancel</button>
            <button onClick={executeSchedule} style={{ flex: 1, padding: '15px', background: '#a855f7', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Sync to Calendar</button>
          </div>
        </div>
      )}

      {/* --- ARCHIVE / PROOF MODAL --- */}
      {archiveModal && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', zIndex: 100, display: 'flex', flexDirection: 'column', padding: '20px', justifyContent: 'center' }}>
          <h2 style={{ color: '#00cc66', textAlign: 'center' }}>Log Completion</h2>
          <p style={{ color: '#ccc', textAlign: 'center', marginBottom: '20px' }}>Snap a photo as proof of completion (Optional).</p>
          
          <label style={{ display: 'block', width: '100%', padding: '20px', background: '#111', border: '2px dashed #00cc66', borderRadius: '12px', textAlign: 'center', color: '#00cc66', fontWeight: 'bold', marginBottom: '20px', cursor: 'pointer' }}>
            📷 {proofImage ? 'Retake Photo' : 'Take Picture'}
            <input type="file" accept="image/*" capture="environment" onChange={handleImageUpload} style={{ display: 'none' }} />
          </label>
          
          {proofImage && <img src={proofImage} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '20px' }} />}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => { setArchiveModal(null); setProofImage(null); }} style={{ flex: 1, padding: '15px', background: '#222', color: '#fff', border: 'none', borderRadius: '8px' }}>Cancel</button>
            <button onClick={confirmArchive} style={{ flex: 1, padding: '15px', background: '#00cc66', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Save to History</button>
          </div>
        </div>
      )}
    </div>
  );
}
