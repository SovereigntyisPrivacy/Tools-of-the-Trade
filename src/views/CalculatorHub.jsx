import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CalculatorHub() {
  const navigate = useNavigate();

  const calculators = [
    { id: 'timesheet', icon: '⏱️', title: 'Fleet Payroll Engine', desc: 'Manage crew rosters, OT liabilities, and 1099 flat-rates.', path: '/calculator/timesheet' },
    { id: 'myschedule', name: 'Personal Shift Tracker', title: 'Personal Shift Tracker', path: '/myschedule', icon: '👤', desc: 'Track your personal shifts, straight-time, and estimate net paychecks.', description: 'Track your personal shifts, straight-time, and estimate net paychecks.' },
      { id: 'tax', icon: '💼', title: 'Tax Calculator', desc: 'Calculate income tax brackets and standard sales tax.', path: '/calculator/tax' },
    { id: 'solar', icon: '⚡', title: 'Solar Array & Battery', desc: 'Calculate panel wattage, battery banks, and inverter loads.', path: '/calculator/solar' },
    { id: 'shooting', icon: '🎯', title: 'Shooting Range', desc: 'Calculate MOA, bullet drop, and windage adjustments.', path: '/calculator/shooting' },
    { id: 'engineering', icon: '📐', title: 'Engineering', desc: 'Structural limits, materials, and physics formulas.', path: '/calculator/engineering' },
    { id: 'nuclear', icon: '☢️', title: 'Nuclear Decay', desc: 'Half-life, radiation shielding, and isotope decay rates.', path: '/calculator/nuclear' },
    { id: 'finance', icon: '💰', title: 'Finance & Loans', desc: 'Mortgage amortization and total interest logic.', path: '/calculator/finance' },
    { id: 'lifestyle', icon: '🏋️', title: 'Lifestyle & Health', desc: 'Culinary yield scaling and 1RM kinetic strength.', path: '/calculator/lifestyle' },
    { id: 'builder', icon: '🔨', title: 'DIY & Builder', desc: 'Construction material estimators and tool logic.', path: '/calculator/builder' },
    { id: 'tech', icon: '💻', title: 'Tech & Network', desc: 'Bandwidth transfer times and IP subnet calculation.', path: '/calculator/tech' },
    { id: 'agronomy', icon: '🌱', title: 'Agronomy & Extract', desc: 'Botanical lighting, extraction yields, and volumetric dosing.', path: '/calculator/agronomy' },
    { id: 'vehicle', icon: '🚛', title: 'Vehicle & Fleet', desc: 'Towing limits, tongue weight, trip cost, and winch recovery.', path: '/vehicle' },
    { id: 'math', icon: '🧮', title: 'Basic Math', desc: 'Standard mathematical operations and calculator functions.', path: '/calculator/math' },
    { id: 'equations', icon: '📚', title: 'Equation Library', desc: 'Reference formulas for manual computations across multiple disciplines.', path: '/calculator/equations' }
  ];

  return (
    <div className="view-wrapper pb-safe">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/')}>Hub</button>
        <h2>Omni-Calculator</h2>
      </header>

      <div className="calc-hub-content" style={{ height: '100%', overflowY: 'auto', paddingBottom: '80px' }}>
        <p className="intro-text" style={{ padding: '0 20px' }}>Select a computation module:</p>
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
