import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider } from './core/ThemeContext';
import './App.css';

const Dashboard = lazy(() => import('./views/Dashboard'));
const Settings = lazy(() => import('./views/Settings'));
const CalculatorHub = lazy(() => import('./views/CalculatorHub'));
const TimesheetCalc = lazy(() => import('./views/TimesheetCalc'));
const TaxCalc = lazy(() => import('./views/TaxCalc'));
const SolarCalc = lazy(() => import('./views/SolarCalc'));
const ElectricCalc = lazy(() => import('./views/ElectricCalc'));
const ShootingCalc = lazy(() => import('./views/ShootingCalc'));
const EngineeringCalc = lazy(() => import('./views/EngineeringCalc'));

function GlobalNav() {
  const location = useLocation();
  const navigate = useNavigate();
  if (location.pathname === '/') return null;
  return (
    <button className="global-home-btn" onClick={() => navigate('/')}>
      🏠 Home
    </button>
  );
}

function App() {
  return (
    <ThemeProvider>
      <div className="app-container">
        <Router>
          <GlobalNav />
          <Suspense fallback={<div className="loading-screen">Loading Tools of the Trade...</div>}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/calculator" element={<CalculatorHub />} />
              <Route path="/calculator/timesheet" element={<TimesheetCalc />} />
              <Route path="/calculator/tax" element={<TaxCalc />} />
              <Route path="/calculator/solar" element={<SolarCalc />} />
              <Route path="/calculator/electric" element={<ElectricCalc />} />
              <Route path="/calculator/shooting" element={<ShootingCalc />} />
              <Route path="/calculator/engineering" element={<EngineeringCalc />} />
            </Routes>
          </Suspense>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
