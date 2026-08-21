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
const ShootingCalc = lazy(() => import('./views/ShootingCalc'));
const EngineeringCalc = lazy(() => import('./views/EngineeringCalc'));
const NuclearCalc = lazy(() => import('./views/NuclearCalc'));
const MathCalc = lazy(() => import('./views/MathCalc'));
const LifestyleCalc = lazy(() => import('./views/LifestyleCalc'));
const TechCalc = lazy(() => import('./views/TechCalc'));
const BuilderCalc = lazy(() => import('./views/BuilderCalc'));
const FinanceCalc = lazy(() => import('./views/FinanceCalc'));

// --- New Standalone Modules ---
const VehicleCalc = lazy(() => import('./views/VehicleCalc'));
const AgronomyCalc = lazy(() => import('./views/AgronomyCalc'));

// Schematics Hubs
const SchematicsHub = lazy(() => import('./views/SchematicsHub'));
const VisualScanner = lazy(() => import('./views/VisualScanner'));
const ElectronicsDatabase = lazy(() => import('./views/ElectronicsDatabase'));
const MechanicsDatabase = lazy(() => import('./views/MechanicsDatabase'));
const BotanyDatabase = lazy(() => import('./views/BotanyDatabase'));
const PharmacologyDatabase = lazy(() => import('./views/PharmacologyDatabase'));
const FirearmsDatabase = lazy(() => import('./views/FirearmsDatabase'));
const SurvivalLibrary = lazy(() => import('./views/SurvivalLibrary'));
const PdfReader = lazy(() => import('./views/PdfReader'));
const SchoolHub = lazy(() => import('./views/SchoolHub'));
const VisualScanner = lazy(() => import('./views/VisualScanner'));

function GlobalNav() {
  const location = useLocation();
  const navigate = useNavigate();
  if (location.pathname === '/') return null;
  return (
    <button className="global-home-btn" onClick={() => navigate('/')}>
      🏠
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
        <Route path="/schematics/scanner" element={<VisualScanner />} />
              <Route path="/schematics/electronics" element={<ElectronicsDatabase />} />
              <Route path="/schematics/mechanics" element={<MechanicsDatabase />} />
              <Route path="/schematics/botany" element={<BotanyDatabase />} />
              <Route path="/schematics/pharmacology" element={<PharmacologyDatabase />} />
              <Route path="/schematics/firearms" element={<FirearmsDatabase />} />
              <Route path="/schematics/library" element={<SurvivalLibrary />} />
              <Route path="/schematics/view/:fileName" element={<PdfReader />} />
        <Route path="/school" element={<SchoolHub />} />
        <Route path="/schematics/scanner" element={<VisualScanner />} />

              {/* Calculators */}
              <Route path="/calculator" element={<CalculatorHub />} />
              <Route path="/calculator/timesheet" element={<TimesheetCalc />} />
              <Route path="/calculator/tax" element={<TaxCalc />} />
              <Route path="/calculator/solar" element={<SolarCalc />} />
              <Route path="/calculator/shooting" element={<ShootingCalc />} />
              <Route path="/calculator/engineering" element={<EngineeringCalc />} />
              <Route path="/calculator/nuclear" element={<NuclearCalc />} />
              <Route path="/calculator/math" element={<MathCalc />} />
              <Route path="/calculator/lifestyle" element={<LifestyleCalc />} />
              <Route path="/calculator/tech" element={<TechCalc />} />
              <Route path="/calculator/builder" element={<BuilderCalc />} />
              <Route path="/calculator/finance" element={<FinanceCalc />} />
              
              {/* New Standalone Modules */}
              <Route path="/vehicle" element={<VehicleCalc />} />
              <Route path="/calculator/agronomy" element={<AgronomyCalc />} />
              
            </Routes>
          </Suspense>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
