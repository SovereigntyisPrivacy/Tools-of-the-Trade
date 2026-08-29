import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Torch } from '@capawesome/capacitor-torch';

// Standard International Morse Code Dictionary
const MORSE_DICT = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....',
  'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.',
  'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
  '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----', ' ': ' '
};

export default function MorseBeacon() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [currentSymbol, setCurrentSymbol] = useState('');
  const [wpm, setWpm] = useState(15); // Words per minute
  const abortController = useRef(new AbortController());

  // Timing logic based on standard WPM
  // A "dot" duration in ms = 1200 / WPM
  const getDotDuration = () => 1200 / wpm;

  const sleep = (ms) => new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    abortController.current.signal.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });

  const encodeMessage = (text) => {
    return text.toUpperCase().split('').map(char => MORSE_DICT[char] || '').join(' ');
  };

  const transmit = async () => {
    if (!message.trim()) return alert("Enter a message to transmit.");
    
    try {
      // Safely turn off before starting to ensure a clean slate
      await Torch.disable();
    } catch (e) {
      console.warn("Torch check failed, attempting anyway...", e);
    }

    setIsTransmitting(true);
    abortController.current = new AbortController();
    const morseCode = encodeMessage(message);
    const dot = getDotDuration();
    const dash = dot * 3;
    const interSymbol = dot; // Space between parts of the same letter
    const interLetter = dot * 3; // Space between letters
    const interWord = dot * 7; // Space between words

    try {
      for (let i = 0; i < morseCode.length; i++) {
        const char = morseCode[i];
        
        if (char === '.') {
          setCurrentSymbol('DOT ( . )');
          await Torch.enable();
          await sleep(dot);
          await Torch.disable();
          await sleep(interSymbol);
        } else if (char === '-') {
          setCurrentSymbol('DASH ( - )');
          await Torch.enable();
          await sleep(dash);
          await Torch.disable();
          await sleep(interSymbol);
        } else if (char === ' ') {
          setCurrentSymbol('SPACE');
          await sleep(interLetter); // Previous symbol already slept interSymbol, so just add more
        }
      }
      setCurrentSymbol('TRANSMISSION COMPLETE');
    } catch (err) {
      if (err.name !== 'AbortError') console.error(err);
      setCurrentSymbol('TRANSMISSION HALTED');
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

  // Cleanup in case the user hits the back button while it's flashing
  useEffect(() => {
    return () => {
      if (isTransmitting) haltTransmission();
    };
  }, [isTransmitting]);

  const glassCard = { background: 'rgba(17, 17, 17, 0.7)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid #222', padding: '20px', marginBottom: '15px' };
  const inputStyle = { background: '#0a0a0a', color: '#fff', border: '1px solid #333', padding: '15px', borderRadius: '8px', width: '100%', marginBottom: '15px', fontSize: '1.1rem', minHeight: '100px', resize: 'vertical' };

  return (
    <div className="view-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'transparent', color: '#fff' }}>
      <header style={{ borderBottom: '1px solid #222', padding: '15px', display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.8)' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#222', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', marginRight: '15px' }}>← Hub</button>
        <h2 style={{ margin: 0, color: '#facc15', fontSize: '1.2rem' }}>Optical Comm Link</h2>
      </header>

      <div style={{ padding: '20px', flex: 1 }}>
        <div style={{ ...glassCard, borderTop: '4px solid #facc15' }}>
          <h3 style={{ color: '#facc15', marginTop: 0, textTransform: 'uppercase' }}>Signal Beacon</h3>
          <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '20px', lineHeight: '1.5' }}>
            Convert text to high-intensity optical flashes using the device's LED array. Visible for miles at night.
          </p>

          <textarea 
            placeholder="Enter transmission payload (e.g. SOS / NEED WINCH)" 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            disabled={isTransmitting}
            style={inputStyle} 
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: '#0a0a0a', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
            <div>
              <span style={{ color: '#888', fontSize: '0.8rem', fontWeight: 'bold', display: 'block' }}>SPEED (WPM)</span>
              <span style={{ color: '#facc15', fontSize: '1.2rem', fontWeight: 'bold' }}>{wpm}</span>
            </div>
            <input 
              type="range" 
              min="5" 
              max="30" 
              value={wpm} 
              onChange={(e) => setWpm(Number(e.target.value))} 
              disabled={isTransmitting}
              style={{ width: '60%', accentColor: '#facc15' }} 
            />
          </div>

          <div style={{ background: '#000', border: '1px solid #333', borderRadius: '8px', padding: '15px', textAlign: 'center', marginBottom: '20px', minHeight: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{ color: '#555', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>Transmission Status</span>
            <span style={{ color: isTransmitting ? '#00ffff' : '#888', fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '2px' }}>
              {currentSymbol || 'STANDBY'}
            </span>
          </div>

          {isTransmitting ? (
            <button onClick={haltTransmission} style={{ width: '100%', background: '#ef4444', color: '#fff', border: 'none', padding: '18px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.2rem', display: 'flex', justifyContent: 'center', gap: '10px' }}>
              🛑 HALT SIGNAL
            </button>
          ) : (
            <button onClick={transmit} style={{ width: '100%', background: '#facc15', color: '#000', border: 'none', padding: '18px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.2rem', display: 'flex', justifyContent: 'center', gap: '10px' }}>
              🔦 TRANSMIT PAYLOAD
            </button>
          )}
        </div>

        <div style={{ ...glassCard }}>
          <h4 style={{ color: '#888', marginTop: 0, textTransform: 'uppercase', fontSize: '0.85rem' }}>Output Preview</h4>
          <p style={{ color: '#facc15', fontFamily: 'monospace', fontSize: '1.2rem', wordWrap: 'break-word', margin: 0, lineHeight: '1.8' }}>
            {encodeMessage(message) || '...'}
          </p>
        </div>
      </div>
    </div>
  );
}
