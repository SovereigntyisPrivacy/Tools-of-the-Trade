import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MathCalc() {
  const navigate = useNavigate();
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');

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
      // Note: In a production financial app, avoid raw eval(). 
      // For a basic math utility running client-side, it functions.
      const sanitized = expression.replace(/×/g, '*').replace(/÷/g, '/');
      const calcResult = Function(`'use strict'; return (${sanitized})`)();
      
      // Handle decimals cleanly
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
        
        {/* DISPLAY SCREEN */}
        <div style={{ background: '#111', borderRadius: '16px', padding: '20px', marginBottom: '20px', border: '1px solid #333', textAlign: 'right', minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div style={{ color: '#888', fontSize: '1.2em', minHeight: '1.2em', wordWrap: 'break-word' }}>
            {expression || '0'}
          </div>
          <div style={{ color: '#00ffff', fontSize: '2.5em', fontWeight: 'bold', marginTop: '10px', wordWrap: 'break-word' }}>
            {result}
          </div>
        </div>

        {/* KEYPAD GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', flex: 1 }}>
          <button onClick={handleClear} style={actionStyle}>AC</button>
          <button onClick={handleDelete} style={{...actionStyle, background: '#f59e0b'}}>DEL</button>
          <button onClick={() => handlePress('%')} style={opStyle}>%</button>
          <button onClick={() => handlePress('/')} style={opStyle}>÷</button>

          <button onClick={() => handlePress('7')} style={btnStyle}>7</button>
          <button onClick={() => handlePress('8')} style={btnStyle}>8</button>
          <button onClick={() => handlePress('9')} style={btnStyle}>9</button>
          <button onClick={() => handlePress('*')} style={opStyle}>×</button>

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
