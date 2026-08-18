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
const NuclearCalc = lazy(() => import('./views/NuclearCalc'));
const MathCalc = lazy(() => import('./views/MathCalc'));
const LifestyleCalc = lazy(() => import('./views/LifestyleCalc'));
const TechCalc = lazy(() => import('./views/TechCalc'));
const BuilderCalc = lazy(() => import('./views/BuilderCalc'));
const FinanceCalc = lazy(() => import('./views/FinanceCalc'));
const SchematicsHub = lazy(() => import('./views/SchematicsHub'));
const GlobalSearch = lazy(() => import('./views/GlobalSearch'));
const Vault = lazy(() => import('./views/Vault'));
const PdfReader = lazy(() => import('./views/PdfReader'));

// New Database Imports
const ElectronicsDatabase = lazy(() => import('./views/ElectronicsDatabase'));

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
              
              {/* Schematics & Databases */}
              <Route path="/schematics" element={<SchematicsHub />} />
              <Route path="/schematics/search" element={<GlobalSearch />} />
              <Route path="/schematics/electronics" element={<ElectronicsDatabase />} />
              
              {/* Vault */}
              <Route path="/vault" element={<Vault />} />
              <Route path="/vault/view/:fileName" element={<PdfReader />} />
              
              {/* Calculators */}
              <Route path="/calculator" element={<CalculatorHub />} />
              <Route path="/calculator/timesheet" element={<TimesheetCalc />} />
              <Route path="/calculator/tax" element={<TaxCalc />} />
              <Route path="/calculator/solar" element={<SolarCalc />} />
              <Route path="/calculator/electric" element={<ElectricCalc />} />
              <Route path="/calculator/shooting" element={<ShootingCalc />} />
              <Route path="/calculator/engineering" element={<EngineeringCalc />} />
              <Route path="/calculator/nuclear" element={<NuclearCalc />} />
              <Route path="/calculator/math" element={<MathCalc />} />
              <Route path="/calculator/lifestyle" element={<LifestyleCalc />} />
              <Route path="/calculator/tech" element={<TechCalc />} />
              <Route path="/calculator/builder" element={<BuilderCalc />} />
              <Route path="/calculator/finance" element={<FinanceCalc />} />
            </Routes>
          </Suspense>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
