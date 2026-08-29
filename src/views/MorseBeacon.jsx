import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Torch } from '@capawesome/capacitor-torch';

const MORSE_DICT = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....',
  'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.',
  'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
  '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----', ' ': ' '
};

const PRO_SIGNS = [
  { meaning: 'SOS (Distress)', code: '... --- ...' },
  { meaning: 'Roger (Received)', code: '.-.' },
  { meaning: 'Wait (Standby)', code: '.-...' },
  { meaning: 'End of Message', code: '.-.-.' }
];

export default function MorseBeacon() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('beacon');
  
  const [message, setMessage] = useState('');
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [currentSymbol, setCurrentSymbol] = useState('');
  const [wpm, setWpm] = useState(15);
  const abortController = useRef(new AbortController());

  const getDotDuration = () => 1200 / wpm;

  const sleep = (ms) => new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    abortController.current.signal.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });

  const encodeMessage = (text) => text.toUpperCase().split('').map(char => MORSE_DICT[char] || '').join(' ');

  // Upgraded to handle both custom messages and single training letters
  const executeFlashSequence = async (payloadText) => {
    if (!payloadText.trim()) return alert("No payload to transmit.");
    
    try { await Torch.disable(); } catch (e) { console.warn("Torch check failed", e); }

    setIsTransmitting(true);
    abortController.current = new AbortController();
    
    // If the payload is already dots/dashes (from the Pro-Signs), use it directly. Otherwise, encode it.
    const isPreEncoded = payloadText.includes('.') || payloadText.includes('-');
    const morseCode = isPreEncoded ? payloadText : encodeMessage(payloadText);
    
    const dot = getDotDuration();
    const dash = dot * 3;
    const interSymbol = dot;
    const interLetter = dot * 3;
    
    try {
      for (let i = 0; i < morseCode.length; i++) {
        const char = morseCode[i];
        if (char === '.') {
          setCurrentSymbol('DOT ( . )');
          await Torch.enable(); await sleep(dot); await Torch.disable(); await sleep(interSymbol);
        } else if (char === '-') {
          setCurrentSymbol('DASH ( - )');
          await Torch.enable(); await sleep(dash); await Torch.disable(); await sleep(interSymbol);
        } else if (char === ' ') {
          setCurrentSymbol('SPACE');
          await sleep(interLetter);
        }
      }
      setCurrentSymbol('COMPLETE');
    } catch (err) {
      if (err.name !== 'AbortError') console.error(err);
      setCurrentSymbol('HALTED');
    } finally {
      try { await Torch.disable(); } catch(e) {}
      setIsTransmitting(false);
    }
  };

  const haltTransmission = async () => {
    abortController.current.abort();
    setIsTransmitting(false);
    try { await Torch.disable(); } catch(e) {}
    setCurrentSymbol('HALTED');
  };

  useEffect(() => {
    return () => { if (isTransmitting) haltTransmission(); };
  }, [isTransmitting]);

  const glassCard = { background: 'rgba(17, 17, 17, 0.7)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid #222', padding: '20px', marginBottom: '15px' };
  const inputStyle = { background: '#0a0a0a', color: '#fff', border: '1px solid #333', padding: '15px', borderRadius: '8px', width: '100%', marginBottom: '15px', fontSize: '1.1rem', minHeight: '100px', resize: 'vertical' };

  const renderBeacon = () => (
    <div style={{ marginTop: '20px' }}>
      <div style={{ ...glassCard, borderTop: '4px solid #facc15' }}>
        <h3 style={{ color: '#facc15', marginTop: 0, textTransform: 'uppercase' }}>Signal Beacon</h3>
        <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '20px', lineHeight: '1.5' }}>Convert text to high-intensity optical flashes using the device's LED array.</p>

        <textarea placeholder="Enter transmission payload (e.g. SOS / NEED WINCH)" value={message} onChange={(e) => setMessage(e.target.value)} disabled={isTransmitting} style={inputStyle} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: '#0a0a0a', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
          <div>
            <span style={{ color: '#888', fontSize: '0.8rem', fontWeight: 'bold', display: 'block' }}>SPEED (WPM)</span>
            <span style={{ color: '#facc15', fontSize: '1.2rem', fontWeight: 'bold' }}>{wpm}</span>
          </div>
          <input type="range" min="5" max="30" value={wpm} onChange={(e) => setWpm(Number(e.target.value))} disabled={isTransmitting} style={{ width: '60%', accentColor: '#facc15' }} />
        </div>

        <div style={{ background: '#000', border: '1px solid #333', borderRadius: '8px', padding: '15px', textAlign: 'center', marginBottom: '20px', minHeight: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ color: '#555', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>Transmission Status</span>
          <span style={{ color: isTransmitting ? '#00ffff' : '#888', fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '2px' }}>{currentSymbol || 'STANDBY'}</span>
        </div>

        {isTransmitting ? (
          <button onClick={haltTransmission} style={{ width: '100%', background: '#ef4444', color: '#fff', border: 'none', padding: '18px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.2rem' }}>🛑 HALT SIGNAL</button>
        ) : (
          <button onClick={() => executeFlashSequence(message)} style={{ width: '100%', background: '#facc15', color: '#000', border: 'none', padding: '18px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.2rem' }}>🔦 TRANSMIT PAYLOAD</button>
        )}
      </div>

      <div style={{ ...glassCard }}>
        <h4 style={{ color: '#888', marginTop: 0, textTransform: 'uppercase', fontSize: '0.85rem' }}>Output Preview</h4>
        <p style={{ color: '#facc15', fontFamily: 'monospace', fontSize: '1.2rem', wordWrap: 'break-word', margin: 0, lineHeight: '1.8' }}>{encodeMessage(message) || '...'}</p>
      </div>
    </div>
  );

  const renderTraining = () => (
    <div style={{ marginTop: '20px' }}>
      
      {/* TIMING PROTOCOL */}
      <div style={{ ...glassCard, borderLeft: '4px solid #3b82f6' }}>
        <h3 style={{ color: '#3b82f6', marginTop: 0, textTransform: 'uppercase' }}>Transmission Protocol</h3>
        <ul style={{ color: '#ccc', fontSize: '0.9rem', lineHeight: '1.6', paddingLeft: '20px', margin: 0 }}>
          <li><strong>Dot (.):</strong> 1 Unit of Time</li>
          <li><strong>Dash (-):</strong> 3 Units of Time</li>
          <li><strong>Gap (Same Letter):</strong> 1 Unit of Time</li>
          <li><strong>Gap (Between Letters):</strong> 3 Units of Time</li>
          <li><strong>Gap (Between Words):</strong> 7 Units of Time</li>
        </ul>
      </div>

      {/* TACTICAL PRO-SIGNS */}
      <h3 style={{ color: '#facc15', textTransform: 'uppercase', textAlign: 'center', marginTop: '30px' }}>Tactical Pro-Signs</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', marginBottom: '20px' }}>
        {PRO_SIGNS.map(sign => (
          <div key={sign.meaning} style={{ ...glassCard, margin: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px' }}>
            <div>
              <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '1rem' }}>{sign.meaning}</div>
              <div style={{ color: '#facc15', fontFamily: 'monospace', fontSize: '1.2rem', marginTop: '5px' }}>{sign.code}</div>
            </div>
            <button onClick={() => executeFlashSequence(sign.code)} disabled={isTransmitting} style={{ background: '#222', color: '#facc15', border: '1px solid #333', padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold' }}>🔦 Play</button>
          </div>
        ))}
      </div>

      {/* INTERACTIVE ALPHABET */}
      <h3 style={{ color: '#10b981', textTransform: 'uppercase', textAlign: 'center', marginTop: '30px' }}>Interactive Alphabet</h3>
      <p style={{ color: '#888', textAlign: 'center', fontSize: '0.85rem', marginBottom: '20px' }}>Tap any letter to flash it via the LED hardware for visual recognition training.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {Object.entries(MORSE_DICT).filter(([char]) => char !== ' ').map(([char, code]) => (
          <div key={char} onClick={() => !isTransmitting && executeFlashSequence(code)} style={{ background: '#111', border: '1px solid #333', borderRadius: '8px', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: isTransmitting ? 'not-allowed' : 'pointer' }}>
            <span style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>{char}</span>
            <span style={{ color: '#10b981', fontFamily: 'monospace', fontSize: '1.2rem', fontWeight: 'bold' }}>{code}</span>
          </div>
        ))}
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
        <button onClick={() => setActiveTab('beacon')} style={{ flex: 1, padding: '10px 15px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'beacon' ? '#facc15' : '#222', color: activeTab === 'beacon' ? '#000' : '#888' }}>Transmitter</button>
        <button onClick={() => setActiveTab('training')} style={{ flex: 1, padding: '10px 15px', borderRadius: '8px', border: 'none', fontWeight: 'bold', background: activeTab === 'training' ? '#3b82f6' : '#222', color: activeTab === 'training' ? '#fff' : '#888' }}>Training Manual</button>
      </div>

      <div style={{ padding: '0 15px 100px 15px', overflowY: 'auto' }}>
        {activeTab === 'beacon' ? renderBeacon() : renderTraining()}
      </div>
    </div>
  );
}
