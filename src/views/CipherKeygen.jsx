import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Preferences } from '@capacitor/preferences';

const DEFAULT_FOLDERS = ['Passwords', 'Network IDs', 'API Keys'];

export default function CipherKeygen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('generator');
  const [isLoaded, setIsLoaded] = useState(false);

  // Vault State
  const [vaultKeys, setVaultKeys] = useState([]);
  const [folders, setFolders] = useState(DEFAULT_FOLDERS);
  const [activeFolder, setActiveFolder] = useState('All');

  // Password Generator State
  const [passLength, setPassLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNums, setUseNums] = useState(true);
  const [useSyms, setUseSyms] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');

  // UUID State
  const [uuidCount, setUuidCount] = useState(1);
  const [generatedUuids, setGeneratedUuids] = useState([]);

  // Translator State
  const [transInput, setTransInput] = useState('');
  const [transOutput, setTransOutput] = useState('');
  const [transMode, setTransMode] = useState('Base64'); // Base64, Hex, Binary
  const [isDecoding, setIsDecoding] = useState(false);

  // Modal State
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [savePayload, setSavePayload] = useState('');
  const [saveTitle, setSaveTitle] = useState('');
  const [saveFolder, setSaveFolder] = useState(DEFAULT_FOLDERS[0]);
  const [saveNotes, setSaveNotes] = useState('');
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // --- NATIVE HARDWARE BOOT ---
  useEffect(() => {
    const loadVault = async () => {
      const { value: keys } = await Preferences.get({ key: 'tot_cipher_vault' });
      if (keys) { try { setVaultKeys(JSON.parse(keys)); } catch(e) {} }
      const { value: flds } = await Preferences.get({ key: 'tot_cipher_folders' });
      if (flds) { try { setFolders(JSON.parse(flds)); } catch(e) {} }
      setIsLoaded(true);
    };
    loadVault();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      Preferences.set({ key: 'tot_cipher_vault', value: JSON.stringify(vaultKeys) });
      Preferences.set({ key: 'tot_cipher_folders', value: JSON.stringify(folders) });
    }
  }, [vaultKeys, folders, isLoaded]);

  const copyToClipboard = (text) => { navigator.clipboard.writeText(text); alert("Copied to Clipboard!"); };

  // --- GENERATORS ---
  const generatePassword = () => {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const nums = "0123456789";
    const syms = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
    
    let charset = "";
    if (useUpper) charset += upper;
    if (useLower) charset += lower;
    if (useNums) charset += nums;
    if (useSyms) charset += syms;
    
    if (!charset) return alert("Select at least one character set.");
    
    let pass = "";
    const randomValues = new Uint32Array(passLength);
    window.crypto.getRandomValues(randomValues);
    for (let i = 0; i < passLength; i++) {
      pass += charset[randomValues[i] % charset.length];
    }
    setGeneratedPassword(pass);
  };

  const generateUUIDs = () => {
    let arr = [];
    for(let i=0; i<uuidCount; i++){
      arr.push(window.crypto.randomUUID());
    }
    setGeneratedUuids(arr);
  };

  // --- TRANSLATOR ---
  useEffect(() => {
    if (!transInput) { setTransOutput(''); return; }
    try {
      let result = '';
      if (!isDecoding) {
        // ENCODE
        if (transMode === 'Base64') result = btoa(unescape(encodeURIComponent(transInput)));
        if (transMode === 'Hex') result = transInput.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
        if (transMode === 'Binary') result = (transInput.replace(/[^01]/g, '').match(/.{1,8}/g) || []).map('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
      } else {
        // DECODE
        if (transMode === 'Base64') result = decodeURIComponent(escape(atob(transInput)));
        if (transMode === 'Hex') result = transInput.replace(/\s+/g, '').match(/.{1,2}/g)?.map(byte => String.fromCharCode(parseInt(byte, 16))).join('') || '';
        if (transMode === 'Binary') result = (transInput.replace(/[^01]/g, '').match(/.{1,8}/g) || []).map(/\s+/).map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
      }
      setTransOutput(result);
    } catch (e) {
      setTransOutput('Error: Invalid input format for decoding.');
    }
  }, [transInput, transMode, isDecoding]);

  // --- VAULT HANDLERS ---
  const handleSaveToVault = () => {
    if(!saveTitle) return alert("Need a title.");
    const newItem = { id: `key_${Date.now()}`, title: saveTitle, folder: saveFolder, payload: savePayload, notes: saveNotes, date: new Date().toLocaleDateString() };
    setVaultKeys([newItem, ...vaultKeys]);
    setShowSaveModal(false); setSaveTitle(''); setSaveNotes('');
  };

  const openSaveModal = (data) => { setSavePayload(data); setShowSaveModal(true); };
  const addFolder = () => { if(newFolderName && !folders.includes(newFolderName)){ setFolders([...folders, newFolderName]); setNewFolderName(''); setShowFolderModal(false); } };

  const glassCard = { background: 'rgba(17, 17, 17, 0.7)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid #222', padding: '20px', marginBottom: '15px' };
  const inputStyle = { background: '#0a0a0a', color: '#fff', border: '1px solid #333', padding: '12px', borderRadius: '6px', width: '100%', marginBottom: '15px', fontSize: '1rem' };

  const renderGenerators = () => (
    <div style={{ marginTop: '20px' }}>
      <div style={{ ...glassCard, borderTop: '4px solid #ec4899' }}>
        <h3 style={{ color: '#ec4899', marginTop: 0, textTransform: 'uppercase' }}>Password Forge</h3>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
          <span style={{ color: '#888', fontWeight: 'bold' }}>LENGTH: <span style={{ color: '#ec4899' }}>{passLength}</span></span>
          <input type="range" min="8" max="64" value={passLength} onChange={e => setPassLength(Number(e.target.value))} style={{ width: '60%', accentColor: '#ec4899' }} />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ccc' }}><input type="checkbox" checked={useUpper} onChange={e=>setUseUpper(e.target.checked)} style={{ accentColor: '#ec4899', width: '20px', height: '20px' }} /> Uppercase (A-Z)</label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ccc' }}><input type="checkbox" checked={useLower} onChange={e=>setUseLower(e.target.checked)} style={{ accentColor: '#ec4899', width: '20px', height: '20px' }} /> Lowercase (a-z)</label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ccc' }}><input type="checkbox" checked={useNums} onChange={e=>setUseNums(e.target.checked)} style={{ accentColor: '#ec4899', width: '20px', height: '20px' }} /> Numbers (0-9)</label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ccc' }}><input type="checkbox" checked={useSyms} onChange={e=>setUseSyms(e.target.checked)} style={{ accentColor: '#ec4899', width: '20px', height: '20px' }} /> Symbols (!@#)</label>
        </div>

        <button onClick={generatePassword} style={{ width: '100%', background: '#ec4899', color: '#fff', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '15px' }}>Generate Password</button>
        
        {generatedPassword && (
          <div style={{ background: '#0a0a0a', border: '1px solid #333', padding: '15px', borderRadius: '8px', textAlign: 'center', wordBreak: 'break-all' }}>
            <span style={{ color: '#fff', fontSize: '1.2rem', fontFamily: 'monospace' }}>{generatedPassword}</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '15px' }}>
              <button onClick={() => copyToClipboard(generatedPassword)} style={{ background: 'transparent', color: '#ec4899', border: '1px dashed #ec4899', padding: '10px', borderRadius: '6px', fontWeight: 'bold' }}>📋 Copy</button>
              <button onClick={() => openSaveModal(generatedPassword)} style={{ background: 'transparent', color: '#10b981', border: '1px dashed #10b981', padding: '10px', borderRadius: '6px', fontWeight: 'bold' }}>💾 Vault</button>
            </div>
          </div>
        )}
      </div>

      <div style={{ ...glassCard, borderTop: '4px solid #8b5cf6' }}>
        <h3 style={{ color: '#8b5cf6', marginTop: 0, textTransform: 'uppercase' }}>UUID Generator</h3>
        <p style={{ color: '#888', fontSize: '0.85rem' }}>Generate cryptographically secure v4 UUIDs for hardware nodes or database keys.</p>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
          <span style={{ color: '#ccc', fontWeight: 'bold' }}>Quantity:</span>
          <input type="number" min="1" max="20" value={uuidCount} onChange={e => setUuidCount(Number(e.target.value))} style={{ ...inputStyle, width: '80px', margin: 0 }} />
        </div>
        <button onClick={generateUUIDs} style={{ width: '100%', background: '#8b5cf6', color: '#fff', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '15px' }}>Generate Keys</button>

        {generatedUuids.length > 0 && (
          <div style={{ background: '#0a0a0a', border: '1px solid #333', padding: '15px', borderRadius: '8px' }}>
            {generatedUuids.map((u, i) => (
              <div key={i} style={{ color: '#fff', fontFamily: 'monospace', fontSize: '0.9rem', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222', paddingBottom: '10px' }}>
                <span style={{ wordBreak: 'break-all' }}>{u}</span>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button onClick={() => copyToClipboard(u)} style={{ background: '#222', color: '#8b5cf6', border: 'none', padding: '6px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>📋</button>
                  <button onClick={() => openSaveModal(u)} style={{ background: '#222', color: '#10b981', border: 'none', padding: '6px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>💾</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderTranslator = () => (
    <div style={{ marginTop: '20px' }}>
      <div style={{ ...glassCard, borderTop: '4px solid #14b8a6' }}>
        <h3 style={{ color: '#14b8a6', marginTop: 0, textTransform: 'uppercase' }}>Data Translator</h3>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <button onClick={() => setIsDecoding(false)} style={{ flex: 1, padding: '10px', background: !isDecoding ? '#14b8a6' : '#222', color: !isDecoding ? '#000' : '#888', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>Encode</button>
          <button onClick={() => setIsDecoding(true)} style={{ flex: 1, padding: '10px', background: isDecoding ? '#f43f5e' : '#222', color: isDecoding ? '#fff' : '#888', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>Decode</button>
        </div>

        <select value={transMode} onChange={e => setTransMode(e.target.value)} style={{ ...inputStyle, background: '#000', color: '#14b8a6', fontWeight: 'bold' }}>
          <option value="Base64">Base64</option><option value="Hex">Hexadecimal</option><option value="Binary">Binary</option>
        </select>

        <textarea placeholder={isDecoding ? "Enter encoded data..." : "Enter raw text..."} value={transInput} onChange={e => setTransInput(e.target.value)} style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} />
        
        <h4 style={{ color: '#888', margin: '0 0 10px 0', textTransform: 'uppercase', fontSize: '0.8rem' }}>Output</h4>
        <textarea readOnly value={transOutput} style={{ ...inputStyle, minHeight: '100px', resize: 'vertical', background: '#050505', color: isDecoding ? '#14b8a6' : '#ec4899', fontFamily: 'monospace' }} />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <button onClick={() => copyToClipboard(transOutput)} style={{ background: 'transparent', color: '#14b8a6', border: '1px dashed #14b8a6', padding: '12px', borderRadius: '6px', fontWeight: 'bold' }}>📋 Copy Output</button>
          <button onClick={() => openSaveModal(transOutput)} style={{ background: 'transparent', color: '#10b981', border: '1px dashed #10b981', padding: '12px', borderRadius: '6px', fontWeight: 'bold' }}>💾 Vault Payload</button>
        </div>
      </div>
    </div>
  );

  const renderIntel = () => (
    <div style={{ marginTop: '20px' }}>
      <div style={{ ...glassCard, borderLeft: '4px solid #ef4444' }}>
        <h3 style={{ color: '#ef4444', marginTop: 0, textTransform: 'uppercase' }}>Legal Disclaimer</h3>
        <p style={{ color: '#ccc', fontSize: '0.85rem', lineHeight: '1.5' }}>This module utilizes offline format translation and pseudo-random key generation. It does <strong>not</strong> perform cryptographic two-way encryption (e.g., AES/RSA). You assume all responsibility for securely managing and backing up your generated keys.</p>
      </div>
      <div style={{ ...glassCard, borderLeft: '4px solid #14b8a6' }}>
        <h3 style={{ color: '#14b8a6', marginTop: 0, textTransform: 'uppercase' }}>OpSec Tips</h3>
        <ul style={{ color: '#ccc', fontSize: '0.85rem', lineHeight: '1.6', paddingLeft: '20px' }}>
          <li><strong>Base64:</strong> Great for encoding images or text to bypass basic filters, but it is easily decoded by anyone. It is <em>not</em> encryption.</li>
          <li><strong>UUIDs:</strong> Use v4 UUIDs for hardware mesh IDs. They are statistically impossible to guess or collide.</li>
          <li><strong>Passwords:</strong> A 16+ character password with symbols takes modern supercomputers trillions of years to brute-force locally.</li>
        </ul>
      </div>
    </div>
  );

  const renderVault = () => {
    const filteredKeys = vaultKeys.filter(k => activeFolder === 'All' || k.folder === activeFolder);
    return (
      <div style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', gap: '8px', paddingBottom: '15px', overflowX: 'auto', alignItems: 'center' }}>
          <button onClick={() => setActiveFolder('All')} style={{ flex: '0 0 auto', padding: '8px 14px', borderRadius: '20px', border: 'none', fontWeight: 'bold', fontSize: '0.8rem', background: activeFolder === 'All' ? '#10b981' : '#222', color: activeFolder === 'All' ? '#000' : '#888' }}>All</button>
          {folders.map(cat => (
            <button key={cat} onClick={() => setActiveFolder(cat)} style={{ flex: '0 0 auto', padding: '8px 14px', borderRadius: '20px', border: 'none', fontWeight: 'bold', fontSize: '0.8rem', background: activeFolder === cat ? '#10b981' : '#222', color: activeFolder === cat ? '#000' : '#888' }}>{cat}</button>
          ))}
          <button onClick={() => setShowFolderModal(true)} style={{ flex: '0 0 auto', padding: '8px 14px', borderRadius: '20px', border: '1px dashed #10b981', background: 'transparent', color: '#10b981', fontWeight: 'bold', fontSize: '0.8rem' }}>+ New</button>
        </div>

        {filteredKeys.length === 0 && <p style={{ color: '#888', textAlign: 'center', fontStyle: 'italic', marginTop: '20px' }}>Vault is empty.</p>}

        {filteredKeys.map(k => (
          <div key={k.id} style={{ ...glassCard, borderLeft: '4px solid #10b981', margin: '0 0 15px 0', padding: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.65rem', background: '#222', color: '#10b981', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>{k.folder}</span>
              <span style={{ fontSize: '0.65rem', color: '#777' }}>{k.date}</span>
            </div>
            <h4 style={{ margin: '0 0 10px 0', color: '#fff', fontSize: '1rem' }}>{k.title}</h4>
            <div style={{ background: '#050505', padding: '10px', borderRadius: '6px', border: '1px solid #333', color: '#0ea5e9', fontFamily: 'monospace', fontSize: '0.85rem', wordBreak: 'break-all', marginBottom: '10px' }}>
              {k.payload}
            </div>
            {k.notes && <p style={{ color: '#888', fontSize: '0.8rem', fontStyle: 'italic', margin: '0 0 10px 0' }}>{k.notes}</p>}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button onClick={() => copyToClipboard(k.payload)} style={{ background: '#222', color: '#10b981', border: 'none', padding: '8px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.85rem' }}>📋 Copy Data</button>
              <button onClick={() => { if(window.confirm('Delete this key?')) setVaultKeys(vaultKeys.filter(x => x.id !== k.id)); }} style={{ background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '8px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.85rem' }}>🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (!isLoaded) return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#000', color: '#ec4899' }}><h2>Loading Engine...</h2></div>;

  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'transparent', color: '#fff' }}>
      <header style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.8)' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', marginRight: '15px' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#ec4899', fontSize: '1.2rem' }}>Cipher & Keygen</h2>
      </header>

      <div style={{ display: 'flex', padding: '15px', gap: '8px', background: 'rgba(0,0,0,0.5)', overflowX: 'auto' }}>
        <button onClick={() => setActiveTab('generator')} style={{ flex: '0 0 auto', padding: '10px 15px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'generator' ? '#ec4899' : '#222', color: activeTab === 'generator' ? '#fff' : '#888' }}>Generators</button>
        <button onClick={() => setActiveTab('translator')} style={{ flex: '0 0 auto', padding: '10px 15px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'translator' ? '#14b8a6' : '#222', color: activeTab === 'translator' ? '#000' : '#888' }}>Translator</button>
        <button onClick={() => setActiveTab('vault')} style={{ flex: '0 0 auto', padding: '10px 15px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'vault' ? '#10b981' : '#222', color: activeTab === 'vault' ? '#000' : '#888' }}>Key Vault</button>
        <button onClick={() => setActiveTab('intel')} style={{ flex: '0 0 auto', padding: '10px 15px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'intel' ? '#ef4444' : '#222', color: activeTab === 'intel' ? '#fff' : '#888' }}>Intel</button>
      </div>

      <div style={{ padding: '0 15px 100px 15px', overflowY: 'auto' }}>
        {activeTab === 'generator' && renderGenerators()}
        {activeTab === 'translator' && renderTranslator()}
        {activeTab === 'vault' && renderVault()}
        {activeTab === 'intel' && renderIntel()}
      </div>

      {/* SAVE MODAL */}
      {showSaveModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', zIndex: 10000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div style={{ background: '#111', border: '1px solid #333', borderRadius: '12px', padding: '20px', width: '100%' }}>
            <h3 style={{ color: '#10b981', marginTop: 0 }}>Save to Key Vault</h3>
            <input type="text" placeholder="Title (e.g. Master Router Pass)" value={saveTitle} onChange={e => setSaveTitle(e.target.value)} style={inputStyle} />
            <select value={saveFolder} onChange={e => setSaveFolder(e.target.value)} style={{ ...inputStyle, background: '#000' }}>
              {folders.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <textarea placeholder="Notes (Optional)" value={saveNotes} onChange={e => setSaveNotes(e.target.value)} style={{ ...inputStyle, minHeight: '60px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button onClick={() => setShowSaveModal(false)} style={{ background: '#222', color: '#888', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>Cancel</button>
              <button onClick={handleSaveToVault} style={{ background: '#10b981', color: '#000', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>💾 Lock In</button>
            </div>
          </div>
        </div>
      )}

      {/* NEW FOLDER MODAL */}
      {showFolderModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', zIndex: 10000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div style={{ background: '#111', border: '1px solid #333', borderRadius: '12px', padding: '20px', width: '100%' }}>
            <h3 style={{ color: '#10b981', marginTop: 0 }}>New Folder</h3>
            <input type="text" placeholder="Folder Name" value={newFolderName} onChange={e => setNewFolderName(e.target.value)} style={inputStyle} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button onClick={() => setShowFolderModal(false)} style={{ background: '#222', color: '#888', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>Cancel</button>
              <button onClick={addFolder} style={{ background: '#10b981', color: '#000', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
