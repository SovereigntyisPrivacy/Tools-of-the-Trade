import React from 'react';
import { useNavigate } from 'react-router-dom';

function CalculatorHub() {
  const navigate = useNavigate();

  const calculators = [
    { id: 'timesheet', icon: '⏰', title: 'Timesheet & Wage', desc: 'Calculate shifts, hours, overtime, and projected net income.', path: '/calculator/timesheet' },
    { id: 'tax', icon: '💼', title: 'Tax Calculator', desc: 'Calculate income tax brackets and standard sales tax.', path: '/calculator/tax' },
    { id: 'solar', icon: '⚡', title: 'Solar Array & Battery', desc: 'Calculate panel wattage, battery banks, and inverter loads.', path: '/calculator/solar' },
    { id: 'shooting', icon: '🎯', title: 'Shooting Range', desc: 'Calculate MOA, bullet drop, and windage adjustments.', path: '/calculator/shooting' },
    { id: 'engineering', icon: '📐', title: 'Engineering', desc: 'Structural limits, materials, and physics formulas.', path: '/calculator/engineering' },
    { id: 'nuclear', icon: '☢️', title: 'Nuclear Decay', desc: 'Half-life, radiation shielding, and isotope decay rates.', path: '/calculator/nuclear' },
    { id: 'finance', icon: '💰', title: 'Finance & Loans', desc: 'Mortgage amortization and total interest logic.', path: '/calculator/finance' },
    { id: 'lifestyle', icon: '🍳', title: 'Lifestyle & Health', desc: 'Culinary yield scaling and 1RM kinetic strength.', path: '/calculator/lifestyle' },
    { id: 'builder', icon: '🛠️', title: 'DIY & Builder', desc: 'Construction material estimators and tool logic.', path: '/calculator/builder' },
    { id: 'tech', icon: '💻', title: 'Tech & Network', desc: 'Bandwidth transfer times and IP subnet calculation.', path: '/calculator/tech' },
    { id: 'agronomy', icon: '🌿', title: 'Agronomy & Extract', desc: 'Botanical lighting, extraction yields, and volumetric dosing.', path: '/calculator/agronomy' },
    { id: 'math', icon: '🧮', title: 'Basic Math', desc: 'Standard mathematical operations and Field Equation Library.', path: '/calculator/math' }
  ];

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/')}>← Hub</button>
        <h2>Omni-Calculator</h2>
      </header>

      <div className="calc-hub-content" style={{ height: '100%', overflowY: 'auto' }}>
        <p className="intro-text">Select a computation module:</p>
        <div className="calc-list">
          {calculators.map(calc => (
            <button key={calc.id} className="calc-list-item" onClick={() => navigate(calc.path)}>
              <span className="calc-icon">{calc.icon}</span>
              <div className="calc-details">
                <span className="calc-title">{calc.title}</span>
                <span className="calc-desc">{calc.desc}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CalculatorHub;
