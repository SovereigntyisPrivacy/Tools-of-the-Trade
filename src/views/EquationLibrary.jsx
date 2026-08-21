import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function EquationLibrary() {
  const navigate = useNavigate();
  const [input, setInput] = useState('');

  const handleCalc = (val) => {
    if (val === 'C') setInput('');
    else if (val === '=') {
      try {
        // Safe local evaluation for simple math strings
        const sanitized = input.replace(/[^-()\d/*+.]/g, '');
        setInput(String(new Function('return ' + sanitized)()));
      } catch (e) {
        setInput('Error');
      }
    } else {
      setInput(input + val);
    }
  };

  const equations = [
    { cat: "Physics - Kinematics", name: "Velocity (Constant Accel)", eq: "v = v₀ + at", desc: "Finds final velocity over time." },
    { cat: "Physics - Kinematics", name: "Distance", eq: "d = v₀t + ½at²", desc: "Calculates distance traveled during acceleration." },
    { cat: "Physics - Kinematics", name: "Newton's 2nd Law", eq: "F = ma", desc: "Force equals mass times acceleration." },
    { cat: "Physics - Energy", name: "Kinetic Energy", eq: "KE = ½mv²", desc: "Energy of an object in motion." },
    { cat: "Physics - Energy", name: "Potential Energy", eq: "PE = mgh", desc: "Gravitational potential energy." },
    { cat: "Physics - Energy", name: "Work", eq: "W = F × d", desc: "Work done by a force over a distance." },
    { cat: "Physics - Energy", name: "Power", eq: "P = W / t", desc: "Rate of doing work (Watts)." },
    { cat: "Electrical", name: "Ohm's Law", eq: "V = I × R", desc: "Voltage = Current × Resistance." },
    { cat: "Electrical", name: "Watt's Law (Power)", eq: "P = I × V", desc: "Electrical power equation." },
    { cat: "Electrical", name: "Resistors in Series", eq: "R(t) = R₁ + R₂ + R₃...", desc: "Total resistance in a series circuit." },
    { cat: "Electrical", name: "Resistors in Parallel", eq: "1/R(t) = 1/R₁ + 1/R₂...", desc: "Total resistance in a parallel circuit." },
    { cat: "Geometry", name: "Pythagorean Theorem", eq: "a² + b² = c²", desc: "Finds the hypotenuse of a right triangle." },
    { cat: "Geometry", name: "Area of a Circle", eq: "A = πr²", desc: "Total area inside a circle." },
    { cat: "Geometry", name: "Circumference", eq: "C = 2πr", desc: "Perimeter distance of a circle." },
    { cat: "Geometry", name: "Volume of a Cylinder", eq: "V = πr²h", desc: "Capacity of a cylindrical container." },
    { cat: "Geometry", name: "Volume of a Sphere", eq: "V = ⁴/₃πr³", desc: "Capacity of a perfectly spherical object." },
    { cat: "Thermodynamics", name: "Specific Heat", eq: "Q = mcΔT", desc: "Heat energy required to change temperature." },
    { cat: "Thermodynamics", name: "Ideal Gas Law", eq: "PV = nRT", desc: "Pressure, Volume, and Temperature relationship." },
    { cat: "Fluids", name: "Pressure", eq: "P = F / A", desc: "Force applied perpendicular to the surface of an object." },
    { cat: "Fluids", name: "Density", eq: "ρ = m / V", desc: "Mass per unit volume of a material." },
    { cat: "Waves", name: "Wave Speed", eq: "v = f × λ", desc: "Velocity of a wave = frequency × wavelength." },
    { cat: "Quantum/Nuclear", name: "Mass-Energy Equiv.", eq: "E = mc²", desc: "Energy of a mass at rest." },
    { cat: "Quantum/Nuclear", name: "Photon Energy", eq: "E = hf", desc: "Energy of a photon (Planck's relation)." },
    { cat: "Finance", name: "Compound Interest", eq: "A = P(1 + r/n)^(nt)", desc: "Future value of an investment or loan." }
  ];

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/calculator')}>← Hub</button>
        <h2>Basic Math & Library</h2>
      </header>

      <div className="calc-content" style={{ padding: '20px', overflowY: 'auto', height: '100%', paddingBottom: '80px' }}>
        
        {/* Quick Calculator */}
        <div className="input-card" style={{ marginBottom: '30px' }}>
          <input type="text" value={input} readOnly style={{ fontSize: '2em', textAlign: 'right', marginBottom: '15px', background: '#000' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {['7','8','9','/','4','5','6','*','1','2','3','-','C','0','.','+'].map(btn => (
              <button key={btn} onClick={() => handleCalc(btn)} style={{ padding: '15px', fontSize: '1.5em', borderRadius: '8px', border: 'none', background: '#333', color: '#fff' }}>
                {btn}
              </button>
            ))}
            <button onClick={() => handleCalc('=')} style={{ gridColumn: 'span 4', padding: '15px', fontSize: '1.5em', borderRadius: '8px', border: 'none', background: '#00cc66', color: '#000', fontWeight: 'bold' }}>
              =
            </button>
          </div>
        </div>

        {/* Equation Library */}
        <h3 style={{ borderBottom: '2px solid #00ffff', paddingBottom: '10px', color: '#00ffff' }}>📚 Field Equation Library</h3>
        <p style={{ color: '#aaa', fontSize: '0.85em', marginBottom: '20px' }}>Reference formulas for manual computations.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {equations.map((item, idx) => (
            <div key={idx} style={{ background: 'rgba(20,20,20,0.8)', border: '1px solid #444', borderRadius: '8px', padding: '15px' }}>
              <div style={{ fontSize: '0.75em', color: '#ffaa00', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>{item.cat}</div>
              <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '1.1em', marginBottom: '8px' }}>{item.name}</div>
              <div style={{ background: '#000', padding: '10px', borderRadius: '5px', color: '#00ffff', fontFamily: 'monospace', fontSize: '1.2em', textAlign: 'center', border: '1px solid #333' }}>
                {item.eq}
              </div>
              <div style={{ color: '#ccc', fontSize: '0.85em', marginTop: '10px' }}>{item.desc}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default MathCalc;
