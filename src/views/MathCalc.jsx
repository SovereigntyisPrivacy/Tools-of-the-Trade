import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MathCalc() {
  const navigate = useNavigate();
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');
  const scrollRef = useRef(null);

  // Auto-scroll the expression box to the bottom as you type
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [expression]);

  const handlePress = (val) => {
    setExpression((prev) => prev + val);
  };

  const handleClear = () => {
    setExpression('');
    setResult('0');
  };

  const handleDelete = () => {
    setExpression((prev) => prev.slice(0, -1));
  };

  const handleCalculate = () => {
    try {
      let sanitized = expression.replace(/×/g, '*').replace(/÷/g, '/');
      
      // Safety catch: strip any trailing operators before calculating
      sanitized = sanitized.replace(/[+\-*/.]$/, '');
      if (!sanitized) return;

      const calcResult = Function(`'use strict'; return (${sanitized})`)();
      
      if (Number.isInteger(calcResult)) {
        setResult(calcResult.toString());
      } else {
        setResult(parseFloat(calcResult.toFixed(8)).toString());
      }
    } catch (e) {
      setResult('Error');
    }
  };

  // --- STYLES ---
  const btnStyle = { padding: '20px', fontSize: '1.5em', background: '#222', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold' };
  const opStyle = { ...btnStyle, background: '#3b82f6', color: '#fff' };
  const actionStyle = { ...btnStyle, background: '#ef4444' };

  return (
    <div className="view-wrapper pb-safe" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222' }}>
        <button className="back-btn" onClick={() => navigate('/calculator')}>Hub</button>
        <h2>Basic Math</h2>
      </header>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px' }}>
        
        {/* SCROLLABLE DISPLAY SCREEN */}
        <div style={{ background: '#111', borderRadius: '16px', padding: '15px 20px', marginBottom: '20px', border: '1px solid #333', textAlign: 'right', height: '180px', display: 'flex', flexDirection: 'column' }}>
          
          <div 
            ref={scrollRef}
            style={{ color: '#888', fontSize: '1.3em', flex: 1, overflowY: 'auto', wordWrap: 'break-word', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: '10px', scrollbarWidth: 'none' }}
          >
            {expression || '0'}
          </div>
          
          <div style={{ color: '#00ffff', fontSize: '2.5em', fontWeight: 'bold', wordWrap: 'break-word', borderTop: '1px solid #333', paddingTop: '10px' }}>
            {result}
          </div>
        </div>

        {/* KEYPAD GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', flex: 1 }}>
          <button onClick={handleClear} style={actionStyle}>AC</button>
          <button onClick={handleDelete} style={{...actionStyle, background: '#f59e0b'}}>DEL</button>
          <button onClick={() => handlePress('%')} style={opStyle}>%</button>
          <button onClick={() => handlePress('÷')} style={opStyle}>÷</button>

          <button onClick={() => handlePress('7')} style={btnStyle}>7</button>
          <button onClick={() => handlePress('8')} style={btnStyle}>8</button>
          <button onClick={() => handlePress('9')} style={btnStyle}>9</button>
          <button onClick={() => handlePress('×')} style={opStyle}>×</button>

          <button onClick={() => handlePress('4')} style={btnStyle}>4</button>
          <button onClick={() => handlePress('5')} style={btnStyle}>5</button>
          <button onClick={() => handlePress('6')} style={btnStyle}>6</button>
          <button onClick={() => handlePress('-')} style={opStyle}>-</button>

          <button onClick={() => handlePress('1')} style={btnStyle}>1</button>
          <button onClick={() => handlePress('2')} style={btnStyle}>2</button>
          <button onClick={() => handlePress('3')} style={btnStyle}>3</button>
          <button onClick={() => handlePress('+')} style={opStyle}>+</button>

          <button onClick={() => handlePress('0')} style={{...btnStyle, gridColumn: 'span 2'}}>0</button>
          <button onClick={() => handlePress('.')} style={btnStyle}>.</button>
          <button onClick={handleCalculate} style={{...opStyle, background: '#00cc66', color: '#000'}}>=</button>
        </div>
      </div>
    </div>
  );
}
