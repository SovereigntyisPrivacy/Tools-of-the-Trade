import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EquationLibrary() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Physics');

  const categories = ['Physics', 'Geometry', 'Electrical'];

  const formulas = {
    Physics: [
      { name: "Kinetic Energy", eq: "KE = ½mv²", vars: "m = mass (kg), v = velocity (m/s)", desc: "Calculates the energy an object possesses due to its motion." },
      { name: "Newton's Second Law", eq: "F = ma", vars: "F = force (Newtons), m = mass (kg), a = acceleration (m/s²)", desc: "Determines the force required to accelerate a specific mass." },
      { name: "Work", eq: "W = Fd cos(θ)", vars: "F = force, d = displacement, θ = angle", desc: "Measures energy transfer when a force moves an object." },
      { name: "Velocity", eq: "v = d/t", vars: "d = distance, t = time", desc: "The rate of change of an object's position." }
    ],
    Geometry: [
      { name: "Pythagorean Theorem", eq: "a² + b² = c²", vars: "a, b = legs, c = hypotenuse", desc: "Finds the length of the longest side of a right-angled triangle." },
      { name: "Area of a Circle", eq: "A = πr²", vars: "r = radius", desc: "Total space enclosed within a circle." },
      { name: "Volume of a Cylinder", eq: "V = πr²h", vars: "r = radius, h = height", desc: "Calculates the capacity of a cylindrical object like a pipe or tank." },
      { name: "Surface Area of a Sphere", eq: "SA = 4πr²", vars: "r = radius", desc: "The total area of the outside of a 3D sphere." }
    ],
    Electrical: [
      { name: "Ohm's Law", eq: "V = IR", vars: "V = voltage (Volts), I = current (Amps), R = resistance (Ohms)", desc: "The foundational law connecting voltage, current, and resistance in a circuit." },
      { name: "Electrical Power", eq: "P = VI", vars: "P = power (Watts), V = voltage, I = current", desc: "Calculates the rate at which electrical energy is transferred by a circuit." },
      { name: "Resistors in Series", eq: "R_total = R₁ + R₂ + ...", vars: "R = individual resistance", desc: "Total resistance when components are wired end-to-end." },
      { name: "Resistors in Parallel", eq: "1/R_total = 1/R₁ + 1/R₂ + ...", vars: "R = individual resistance", desc: "Total resistance when components are wired across each other." }
    ]
  };

  return (
    <div className="view-wrapper pb-safe" style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ borderBottom: '1px solid #222' }}>
        <button className="back-btn" onClick={() => navigate('/calculator')}>Hub</button>
        <h2>Equation Library</h2>
      </header>

      {/* TOP TABS */}
      <div style={{ display: 'flex', background: '#111', padding: '10px', borderBottom: '1px solid #333', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{ flex: 1, padding: '10px 16px', borderRadius: '8px', fontWeight: 'bold', border: 'none', whiteSpace: 'nowrap', background: activeCategory === cat ? '#00ffff' : '#222', color: activeCategory === cat ? '#000' : '#aaa' }}>
            {cat}
          </button>
        ))}
      </div>

      <div className="calc-content" style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
        {formulas[activeCategory].map((item, idx) => (
          <div key={idx} style={{ background: '#111', borderRadius: '12px', border: '1px solid #333', padding: '20px', marginBottom: '15px', borderLeft: '4px solid #00ffff' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#fff', fontSize: '1.2em' }}>{item.name}</h3>
            
            <div style={{ background: '#000', padding: '15px', borderRadius: '8px', border: '1px solid #222', marginBottom: '15px', textAlign: 'center' }}>
              <span style={{ color: '#00ffff', fontSize: '1.5em', fontWeight: 'bold', fontFamily: 'monospace' }}>{item.eq}</span>
            </div>
            
            <h4 style={{ margin: '0 0 5px 0', color: '#888', fontSize: '0.85em', textTransform: 'uppercase', letterSpacing: '1px' }}>Variables</h4>
            <p style={{ color: '#aaa', margin: '0 0 15px 0', fontSize: '0.9em', lineHeight: '1.5' }}>{item.vars}</p>
            
            <h4 style={{ margin: '0 0 5px 0', color: '#888', fontSize: '0.85em', textTransform: 'uppercase', letterSpacing: '1px' }}>Application</h4>
            <p style={{ color: '#aaa', margin: '0', fontSize: '0.9em', lineHeight: '1.5', fontStyle: 'italic' }}>"{item.desc}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}
