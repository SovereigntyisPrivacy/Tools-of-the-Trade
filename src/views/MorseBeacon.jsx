import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Torch } from '@capawesome/capacitor-torch';

const NATO_PHONETIC = { 'A':'ALPHA', 'B':'BRAVO', 'C':'CHARLIE', 'D':'DELTA', 'E':'ECHO', 'F':'FOXTROT', 'G':'GOLF', 'H':'HOTEL', 'I':'INDIA', 'J':'JULIET', 'K':'KILO', 'L':'LIMA', 'M':'MIKE', 'N':'NOVEMBER', 'O':'OSCAR', 'P':'PAPA', 'Q':'QUEBEC', 'R':'ROMEO', 'S':'SIERRA', 'T':'TANGO', 'U':'UNIFORM', 'V':'VICTOR', 'W':'WHISKEY', 'X':'X-RAY', 'Y':'YANKEE', 'Z':'ZULU' };
const MORSE_DICT = { 'A':'.-', 'B':'-...', 'C':'-.-.', 'D':'-..', 'E':'.', 'F':'..-.', 'G':'--.', 'H':'....', 'I':'..', 'J':'.---', 'K':'-.-', 'L':'.-..', 'M':'--', 'N':'-.', 'O':'---', 'P':'.--.', 'Q':'--.-', 'R':'.-.', 'S':'...', 'T':'-', 'U':'..-', 'V':'...-', 'W':'.--', 'X':'-..-', 'Y':'-.--', 'Z':'--..', '1':'.----', '2':'..---', '3':'...--', '4':'....-', '5':'.....', '6':'-....', '7':'--...', '8':'---..', '9':'----.', '0':'-----', '.':'.-.-.-', ',':'--..--', '?':'..--..', '/':'-..-.', '@':'.--.-.' };

const REVERSE_MORSE = Object.keys(MORSE_DICT).reduce((ret, key) => { ret[MORSE_DICT[key]] = key; return ret; }, {});

const PRO_SIGNS = [
  { meaning: 'SOS (Distress)', code: '... --- ...' }, { meaning: 'Roger (Received)', code: '.-.' },
  { meaning: 'Wilco (Will Comply)', code: '.-.-.' }, { meaning: 'Wait (Standby)', code: '.-...' },
  { meaning: 'Error (Correction)', code: '........' }, { meaning: 'End of Message', code: '.-.-.' }
];

const GROUND_TO_AIR = [
  { symbol: 'V', meaning: 'Require Assistance' }, { symbol: 'X', meaning: 'Require Medical Assistance' },
  { symbol: 'N', meaning: 'No / Negative' }, { symbol: 'Y', meaning: 'Yes / Affirmative' }, { symbol: '↑', meaning: 'Proceeding in this direction' }
];

const TAP_CODE = [
  ['A','B','C/K','D','E'], ['F','G','H','I','J'], ['L','M','N','O','P'], ['Q','R','S','T','U'], ['V','W','X','Y','Z']
];

export default function MorseBeacon() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('beacon');
  
  // Beacon State
  const [message, setMessage] = useState('');
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [currentSymbol, setCurrentSymbol] = useState('');
  const [wpm, setWpm] = useState(15);
  const abortController = useRef(new AbortController());

  // Translator State
  const [transEng, setTransEng] = useState('');
  const [transMorse, setTransMorse] = useState('');


  const getDotDuration = () => 1200 / wpm;
  const sleep = (ms) => new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    abortController.current.signal.addEventListener('abort', () => { clearTimeout(timer); reject(new DOMException('Aborted', 'AbortError')); });
  });

  // Re-engineered to respect standard 7-dot word gaps using a forward slash
  const encodeMessage = (text) => text.toUpperCase().trim().split(/\s+/).map(word => word.split('').map(char => MORSE_DICT[char] || '').filter(Boolean).join(' ')).join(' / ');

  const executeFlashSequence = async (payloadText, loop = false) => {
    if (!payloadText.trim()) return alert("No payload to transmit.");
    try { await Torch.disable(); } catch (e) { console.warn("Torch fallback", e); }
    
    setIsTransmitting(true);
    abortController.current = new AbortController();

    // STRICT REGEX FIX: Only true if it strictly contains dots, dashes, spaces, and slashes.
    const isPreEncoded = /^[.\- /]+$/.test(payloadText.trim());
    const morseCode = isPreEncoded ? payloadText : encodeMessage(payloadText);

    const dot = getDotDuration(); const dash = dot * 3; 
    const interSymbol = dot; const interLetter = dot * 3; const interWord = dot * 7;

    try {
      do {
        for (let i = 0; i < morseCode.length; i++) {
          const char = morseCode[i];
          if (char === '.') { setCurrentSymbol("DOT ( . )"); await Torch.enable(); await sleep(dot); await Torch.disable(); await sleep(interSymbol); } 
          else if (char === '-') { setCurrentSymbol("DASH ( - )"); await Torch.enable(); await sleep(dash); await Torch.disable(); await sleep(interSymbol); } 
          else if (char === ' ') { setCurrentSymbol("SPACE"); await sleep(interLetter); }
          else if (char === '/') { setCurrentSymbol("WORD GAP"); await sleep(interWord); }
        }
        if (loop) { setCurrentSymbol("LOOP RESTARTING..."); await sleep(interWord * 2); }
      } while (loop && !abortController.current.signal.aborted);
      setCurrentSymbol("COMPLETE");
    } catch (err) {
      if (err.name !== 'AbortError') console.error(err);
      setCurrentSymbol("HALTED");
    } finally {
      try { await Torch.disable(); } catch(e) {}
      setIsTransmitting(false);
    }
  };

  const haltTransmission = async () => {
    abortController.current.abort(); setIsTransmitting(false); setIsLooping(false);
    try { await Torch.disable(); } catch(e) {}
    setCurrentSymbol("HALTED");
  };

  useEffect(() => { return () => { if (isTransmitting) haltTransmission(); }; }, [isTransmitting]);

  // Two-Way Translator Logic
  const handleEngChange = (val) => {
    setTransEng(val);
    setTransMorse(encodeMessage(val));
  };
  const handleMorseChange = (val) => {
    setTransMorse(val);
    const decoded = val.split('/').map(word => word.trim().split(/\s+/).map(code => REVERSE_MORSE[code] || '?').join('')).join(' ');
    setTransEng(decoded);
  };

  const glassCard = { background: 'rgba(17, 17, 17, 0.7)', borderRadius: '12px', border: '1px solid #333', padding: '15px', marginBottom: '15px' };
  const inputStyle = { background: '#000', color: '#fff', border: '1px solid #333', padding: '15px', borderRadius: '8px', width: '100%', marginBottom: '15px', fontSize: '1.1rem' };


  const renderBeacon = () => (
    <div style={{ marginTop: '20px' }}>
      <div style={{ ...glassCard, borderTop: '4px solid #facc15' }}>
        <h3 style={{ color: '#facc15', marginTop: 0, textTransform: 'uppercase' }}>Optical Signal Beacon</h3>
        <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '20px', lineHeight: '1.5' }}>Convert text to high-intensity flashes using the device's LED array. For maximum distance, focus the LED through a reflective surface or binoculars.</p>
        
        <textarea placeholder="Enter transmission payload (e.g. SOS / NEED WINCH)" value={message} onChange={(e) => setMessage(e.target.value)} disabled={isTransmitting} style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: '#0a0a0a', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
          <div><span style={{ color: '#888', fontSize: '0.8rem', fontWeight: 'bold', display: 'block' }}>SPEED (WPM)</span><span style={{ color: '#facc15', fontSize: '1.2rem', fontWeight: 'bold' }}>{wpm}</span></div>
          <input type="range" min="5" max="30" value={wpm} onChange={(e) => setWpm(Number(e.target.value))} disabled={isTransmitting} style={{ width: '60%', accentColor: '#facc15' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', padding: '10px', background: '#000', borderRadius: '8px', border: '1px solid #333' }}>
          <input type="checkbox" checked={isLooping} onChange={(e) => setIsLooping(e.target.checked)} disabled={isTransmitting} style={{ width: '20px', height: '20px', accentColor: '#facc15', marginRight: '10px' }} />
          <label style={{ color: '#fff', fontWeight: 'bold', fontSize: '1rem' }}>Infinite Loop (SOS Mode)</label>
        </div>

        <div style={{ background: '#000', border: '1px solid #333', borderRadius: '8px', padding: '15px', textAlign: 'center', marginBottom: '20px', minHeight: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ color: '#555', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>Transmission Status</span>
          <span style={{ color: isTransmitting ? '#00ffff' : '#888', fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '2px' }}>{currentSymbol || 'STANDBY'}</span>
        </div>

        {isTransmitting ? (
          <button onClick={haltTransmission} style={{ width: '100%', background: '#ef4444', color: '#fff', border: 'none', padding: '18px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.2rem' }}>🛑 HALT SIGNAL</button>
        ) : (
          <button onClick={() => executeFlashSequence(message, isLooping)} style={{ width: '100%', background: '#facc15', color: '#000', border: 'none', padding: '18px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.2rem' }}>🔦 TRANSMIT PAYLOAD</button>
        )}
      </div>
    </div>
  );

  const renderTranslator = () => (
    <div style={{ marginTop: '20px' }}>
      <div style={{ ...glassCard, borderTop: '4px solid #3b82f6' }}>
        <h3 style={{ color: '#3b82f6', marginTop: 0, textTransform: 'uppercase' }}>Two-Way Translator</h3>
        <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '20px' }}>Type English to generate Morse, or paste Morse to decode it back to English. Uses slashes (/) for word breaks.</p>
        <label style={{ display: 'block', color: '#fff', fontWeight: 'bold', marginBottom: '5px' }}>Plain Text (English)</label>
        <textarea placeholder="Enter text..." value={transEng} onChange={e => handleEngChange(e.target.value)} style={{ ...inputStyle, minHeight: '100px', borderColor: '#3b82f6' }} />
        <label style={{ display: 'block', color: '#facc15', fontWeight: 'bold', marginBottom: '5px' }}>Morse Code Output</label>
        <textarea placeholder=".-.. .. ...- . / ..-. .-. . ." value={transMorse} onChange={e => handleMorseChange(e.target.value)} style={{ ...inputStyle, minHeight: '120px', fontFamily: 'monospace', fontSize: '1.5rem', letterSpacing: '2px', borderColor: '#facc15' }} />
      </div>
    </div>
  );


  const renderTraining = () => (
    <div style={{ marginTop: '20px' }}>
      <div style={{ ...glassCard, borderLeft: '4px solid #facc15' }}>
        <h3 style={{ color: '#facc15', marginTop: 0, textTransform: 'uppercase' }}>Tactical Pro-Signs</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
          {PRO_SIGNS.map(sign => (
            <div key={sign.meaning} style={{ ...glassCard, margin: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px' }}>
              <div>
                <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '1rem' }}>{sign.meaning}</div>
                <div style={{ color: '#facc15', fontFamily: 'monospace', fontSize: '1.2rem', marginTop: '5px' }}>{sign.code}</div>
              </div>
              <button onClick={() => { setActiveTab('beacon'); setMessage(sign.code); }} disabled={isTransmitting} style={{ background: '#222', color: '#facc15', border: '1px solid #333', padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold' }}>Load</button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...glassCard, borderLeft: '4px solid #a855f7' }}>
        <h3 style={{ color: '#a855f7', marginTop: 0, textTransform: 'uppercase' }}>Acoustic Tap Code (POW Matrix)</h3>
        <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '15px' }}>Used for communicating through walls/pipes by tapping. Number of taps corresponds to the Row, pause, then Column. (e.g., 'HELP' = 2,3 - 1,5 - 3,1 - 3,5). 'C' and 'K' share the same knock.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr 1fr 1fr 1fr', gap: '5px', textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>
          <div style={{ color: '#a855f7' }}>#</div><div style={{ color: '#a855f7' }}>Col 1</div><div style={{ color: '#a855f7' }}>Col 2</div><div style={{ color: '#a855f7' }}>Col 3</div><div style={{ color: '#a855f7' }}>Col 4</div><div style={{ color: '#a855f7' }}>Col 5</div>
          {TAP_CODE.map((row, rIdx) => (
            <React.Fragment key={rIdx}>
              <div style={{ color: '#a855f7', alignContent: 'center' }}>Row {rIdx + 1}</div>
              {row.map((letter, cIdx) => (
                <div key={cIdx} style={{ background: '#000', border: '1px solid #333', padding: '10px', borderRadius: '6px' }}>{letter}</div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div style={{ ...glassCard, borderLeft: '4px solid #ef4444' }}>
        <h3 style={{ color: '#ef4444', marginTop: 0, textTransform: 'uppercase' }}>Ground-to-Air Visual Codes</h3>
        <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '15px' }}>Construct these symbols on the ground using highly contrasting materials (rocks, logs, space blankets) sized at least 10x10 feet.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
          {GROUND_TO_AIR.map(signal => (
            <div key={signal.symbol} style={{ background: '#111', border: '1px solid #333', borderRadius: '8px', padding: '15px', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <span style={{ color: '#ef4444', fontSize: '2rem', fontWeight: 'bold', minWidth: '40px', textAlign: 'center' }}>{signal.symbol}</span>
              <span style={{ color: '#ccc', fontSize: '1rem', fontWeight: 'bold' }}>{signal.meaning}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'transparent', color: '#fff' }}>
      <header style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.8)' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', marginRight: '15px' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#facc15', fontSize: '1.2rem' }}>Optical Comm Link</h2>
      </header>

      <div style={{ display: 'flex', padding: '15px', gap: '8px', background: 'rgba(0,0,0,0.5)', overflowX: 'auto' }}>
        {['beacon', 'translator', 'training'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: '1 0 auto', padding: '10px 15px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === tab ? '#facc15' : '#222', color: activeTab === tab ? '#000' : '#888', textTransform: 'capitalize' }}>{tab}</button>
        ))}
      </div>

      <div style={{ padding: '0 15px 100px 15px', overflowY: 'auto' }}>
        {activeTab === 'beacon' && renderBeacon()}
        {activeTab === 'translator' && renderTranslator()}
        {activeTab === 'training' && renderTraining()}
      </div>
    </div>
  );
}
