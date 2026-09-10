import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TasklistCreator() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Active');
  
  // Creation States
  const [newListTitle, setNewListTitle] = useState('');
  const [newListTasks, setNewListTasks] = useState(''); // For bulk setup
  const [newTaskInputs, setNewTaskInputs] = useState({});

  // Initialize from LocalStorage for permanent offline persistence
  const [taskLists, setTaskLists] = useState(() => {
    const saved = localStorage.getItem('sovereign_tasklists');
    return saved ? JSON.parse(saved) : [];
  });

  // Auto-save to LocalStorage whenever the data changes
  useEffect(() => {
    localStorage.setItem('sovereign_tasklists', JSON.stringify(taskLists));
  }, [taskLists]);

  const createNewList = () => {
    if (!newListTitle.trim()) return;
    
    // Parse the textarea by line breaks to bulk-generate tasks
    const initialTasks = newListTasks
      .split('\n')
      .filter(t => t.trim() !== '')
      .map((t, index) => ({
        id: Date.now().toString() + index,
        text: t.trim(),
        completed: false,
        completedAt: null
      }));

    const newList = {
      id: Date.now().toString(),
      title: newListTitle,
      status: 'active',
      createdAt: new Date().toLocaleDateString(),
      tasks: initialTasks
    };
    
    setTaskLists([newList, ...taskLists]);
    setNewListTitle('');
    setNewListTasks(''); // clear the bulk setup area
  };

  const addTask = (listId) => {
    const taskText = newTaskInputs[listId];
    if (!taskText?.trim()) return;
    
    setTaskLists(taskLists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          tasks: [...list.tasks, { id: Date.now().toString(), text: taskText, completed: false, completedAt: null }]
        };
      }
      return list;
    }));
    setNewTaskInputs({ ...newTaskInputs, [listId]: '' });
  };

  const toggleTask = (listId, taskId) => {
    setTaskLists(taskLists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          tasks: list.tasks.map(task => {
            if (task.id === taskId) {
              const isCompleted = !task.completed;
              return { 
                ...task, 
                completed: isCompleted,
                // Stamp the exact time if checked, erase it if unchecked (redo)
                completedAt: isCompleted ? new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : null
              };
            }
            return task;
          })
        };
      }
      return list;
    }));
  };

  const archiveList = (listId) => {
    setTaskLists(taskLists.map(list => 
      list.id === listId ? { ...list, status: 'archived', archivedAt: new Date().toLocaleDateString() } : list
    ));
  };

  const restoreList = (listId) => {
    setTaskLists(taskLists.map(list => 
      list.id === listId ? { ...list, status: 'active', archivedAt: null } : list
    ));
  };

  const deleteList = (listId) => {
    setTaskLists(taskLists.filter(list => list.id !== listId));
  };

  const activeLists = taskLists.filter(list => list.status === 'active');
  const archivedLists = taskLists.filter(list => list.status === 'archived');

  return (
    <div className="view-wrapper pb-safe" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* HEADER */}
      <header className="header" style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', marginRight: '15px' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#a855f7', fontSize: '1.2em', textTransform: 'uppercase', letterSpacing: '1px' }}>Tasklist Engine</h2>
      </header>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '10px', padding: '15px', borderBottom: '1px solid #222' }}>
        <button 
          onClick={() => setActiveTab('Active')}
          style={{ flex: 1, padding: '10px', background: activeTab === 'Active' ? 'rgba(168, 85, 247, 0.15)' : '#111', color: activeTab === 'Active' ? '#a855f7' : '#888', border: activeTab === 'Active' ? '1px solid #a855f7' : '1px solid #333', borderRadius: '8px', fontWeight: 'bold', transition: 'all 0.2s' }}>
          Active Ops
        </button>
        <button 
          onClick={() => setActiveTab('History')}
          style={{ flex: 1, padding: '10px', background: activeTab === 'History' ? 'rgba(16, 185, 129, 0.15)' : '#111', color: activeTab === 'History' ? '#10b981' : '#888', border: activeTab === 'History' ? '1px solid #10b981' : '1px solid #333', borderRadius: '8px', fontWeight: 'bold', transition: 'all 0.2s' }}>
          Historical Ledger
        </button>
      </div>

      <div style={{ padding: '20px', overflowY: 'auto' }}>
        
        {/* ACTIVE TAB */}
        {activeTab === 'Active' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* BULK CREATION SETUP UI */}
            <div style={{ background: '#111', padding: '15px', borderRadius: '12px', border: '1px dashed #333', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h4 style={{ margin: 0, color: '#888', textTransform: 'uppercase', fontSize: '0.85em' }}>Create New Operation</h4>
              <input 
                type="text" 
                placeholder="Operation Title (e.g., Vehicle Maintenance)" 
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #222', background: '#000', color: '#fff', boxSizing: 'border-box' }}
              />
              <textarea 
                placeholder="Pre-load Tasks (Optional: Paste or type one task per line)"
                value={newListTasks}
                onChange={(e) => setNewListTasks(e.target.value)}
                rows="3"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #222', background: '#000', color: '#ccc', boxSizing: 'border-box', resize: 'vertical' }}
              />
              <button onClick={createNewList} style={{ background: '#a855f7', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', width: '100%' }}>INITIALIZE CHECKLIST</button>
            </div>

            {activeLists.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#555', padding: '20px 0' }}>No active operations.</div>
            ) : (
              activeLists.map(list => {
                const total = list.tasks.length;
                const completed = list.tasks.filter(t => t.completed).length;
                
                return (
                  <div key={list.id} style={{ background: '#111', borderRadius: '12px', padding: '15px', border: '1px solid #333' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                      <h3 style={{ margin: 0, color: '#fff' }}>{list.title}</h3>
                      <button onClick={() => archiveList(list.id)} style={{ background: 'transparent', color: '#10b981', border: '1px solid #10b981', padding: '5px 10px', borderRadius: '6px', fontSize: '0.8em', fontWeight: 'bold' }}>ARCHIVE</button>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                      <input 
                        type="text" 
                        placeholder="Add task on the fly..." 
                        value={newTaskInputs[list.id] || ''}
                        onChange={(e) => setNewTaskInputs({ ...newTaskInputs, [list.id]: e.target.value })}
                        style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #222', background: '#000', color: '#ccc', fontSize: '0.9em' }}
                      />
                      <button onClick={() => addTask(list.id)} style={{ background: '#333', color: '#fff', border: 'none', padding: '0 15px', borderRadius: '6px' }}>+</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {list.tasks.map(task => (
                        <div key={task.id} onClick={() => toggleTask(list.id, task.id)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: '#0a0a0a', borderRadius: '6px', cursor: 'pointer' }}>
                          <div style={{ width: '20px', height: '20px', borderRadius: '4px', border: `2px solid ${task.completed ? '#a855f7' : '#555'}`, background: task.completed ? '#a855f7' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {task.completed && <span style={{ color: '#fff', fontSize: '12px' }}>✓</span>}
                          </div>
                          <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: task.completed ? '#555' : '#ccc', textDecoration: task.completed ? 'line-through' : 'none' }}>{task.text}</span>
                            {task.completedAt && (
                              <span style={{ color: '#a855f7', fontSize: '0.75em', fontWeight: 'bold' }}>{task.completedAt}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'History' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {archivedLists.length === 0 ? (
               <div style={{ textAlign: 'center', color: '#555', padding: '40px 0' }}>The historical ledger is empty.</div>
            ) : (
              archivedLists.map(list => (
                <div key={list.id} style={{ background: '#0a0a0a', borderRadius: '12px', padding: '15px', border: '1px solid #222' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #222', paddingBottom: '10px' }}>
                    <div>
                      <h3 style={{ margin: 0, color: '#10b981' }}>{list.title}</h3>
                      <span style={{ fontSize: '0.75em', color: '#555' }}>Archived: {list.archivedAt}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => restoreList(list.id)} style={{ background: 'transparent', color: '#3b82f6', border: '1px solid #3b82f6', padding: '5px 10px', borderRadius: '6px', fontSize: '0.8em', fontWeight: 'bold' }}>RESTORE</button>
                      <button onClick={() => deleteList(list.id)} style={{ background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '5px 10px', borderRadius: '6px', fontSize: '0.8em', fontWeight: 'bold' }}>PURGE</button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {list.tasks.map(task => (
                        <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ color: task.completed ? '#10b981' : '#ef4444', fontSize: '1.2em' }}>{task.completed ? '✓' : '✗'}</span>
                            <span style={{ color: '#888', textDecoration: task.completed ? 'none' : 'line-through' }}>{task.text}</span>
                          </div>
                          {task.completedAt && (
                            <span style={{ color: '#555', fontSize: '0.75em' }}>{task.completedAt}</span>
                          )}
                        </div>
                      ))}
                    </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}
