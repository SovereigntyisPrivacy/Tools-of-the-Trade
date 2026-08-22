import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MathCalc() {
  const navigate = useNavigate();
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');
  const [calculationHistory, setCalculationHistory] = useState([]);
  const scrollRef = useRef(null);

  // Auto-scroll the history box to the bottom when new items are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [calculationHistory, expression]);

  const handlePress = (val) => {
    setExpression((prev) => prev + val);
  };

  const handleClear = () => {
    setExpression('');
    setResult('0');
  };

  const handleClearAll = () => {
    setExpression('');
    setResult('0');
    setCalculationHistory([]);
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
      
      let finalResult = '0';
      if (Number.isInteger(calcResult)) {
        finalResult = calcResult.toString();
      } else {
        finalResult = parseFloat(calcResult.toFixed(8)).toString();
      }

      setResult(finalResult);
      
      // Add to history
      setCalculationHistory(prev => [...prev, { expr: expression, res: finalResult }]);
      setExpression(finalResult); // Setup the next calculation to start with the result

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
        <div style={{ background: '#111', borderRadius: '16px', padding: '15px 20px', marginBottom: '20px', border: '1px solid #333', textAlign: 'right', display: 'flex', flexDirection: 'column', flex: 1, maxHeight: '35vh' }}>
          
          {/* HISTORY AREA */}
          <div 
            ref={scrollRef}
            style={{ color: '#888', fontSize: '1.1em', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', scrollbarWidth: 'none', borderBottom: '1px dashed #333', paddingBottom: '10px', marginBottom: '10px' }}
          >
            {calculationHistory.map((item, index) => (
              <div key={index} style={{ marginBottom: '8px' }}>
                <div style={{ color: '#666' }}>{item.expr}</div>
                <div style={{ color: '#00cc66', fontWeight: 'bold' }}>= {item.res}</div>
              </div>
            ))}
          </div>

          {/* CURRENT INPUT */}
          <div style={{ color: '#fff', fontSize: '1.5em', wordWrap: 'break-word', minHeight: '1.5em' }}>
            {expression || '0'}
          </div>
          
          <div style={{ color: '#00ffff', fontSize: '2.5em', fontWeight: 'bold', wordWrap: 'break-word', marginTop: '5px' }}>
            {result}
          </div>
        </div>

        {/* KEYPAD GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          <button onClick={handleClear} onDoubleClick={handleClearAll} style={actionStyle}>AC</button>
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
