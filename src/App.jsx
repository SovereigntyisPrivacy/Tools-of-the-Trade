import React, { Suspense, lazy, useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider } from './core/ThemeContext';
import { CalendarProvider } from './core/CalendarContext';
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
const EquationLibrary = lazy(() => import('./views/EquationLibrary'));
const LifestyleCalc = lazy(() => import('./views/LifestyleCalc'));
const TechCalc = lazy(() => import('./views/TechCalc'));
const BuilderCalc = lazy(() => import('./views/BuilderCalc'));
const FinanceCalc = lazy(() => import('./views/FinanceCalc'));

// --- Standalone Modules ---
const SupportCreator = lazy(() => import('./views/SupportCreator'));
const QRScanner = lazy(() => import('./views/QRScanner'));
const BudgetEngine = lazy(() => import('./views/BudgetEngine'));
const ChronosHub = lazy(() => import('./views/ChronosHub'));
const BurnerPad = lazy(() => import('./views/BurnerPad'));
const TasklistCreator = lazy(() => import('./views/TasklistCreator'));
const AccessKeyring = lazy(() => import('./views/AccessKeyring'));
const MyShiftTracker = lazy(() => import('./views/MyShiftTracker'));
const LearningHub = lazy(() => import('./views/LearningHub'));
const SubscriptionTracker = lazy(() => import('./views/SubscriptionTracker'));
const DataVault = lazy(() => import('./views/DataVault'));
const CalendarHub = lazy(() => import('./views/CalendarHub'));
const WorldClock = lazy(() => import('./views/WorldClock'));
const QuickCalc = lazy(() => import('./views/QuickCalc'));
const VehicleCalc = lazy(() => import('./views/VehicleCalc'));
const AgronomyCalc = lazy(() => import('./views/AgronomyCalc'));
const AssetLedger = lazy(() => import('./views/AssetLedger'));
const CivicsRights = lazy(() => import('./views/CivicsRights'));
const MindsetTracker = lazy(() => import('./views/MindsetTracker'));

// Schematics & Database Hubs
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
const Vault = lazy(() => import('./views/Vault'));

const MorseBeacon = lazy(() => import('./views/MorseBeacon'));
const CipherKeygen = lazy(() => import('./views/CipherKeygen'));
const FirstAidHub = lazy(() => import('./views/FirstAidHub'));

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
  const accessPin = localStorage.getItem('fleet_access_pin');
  const duressPin = localStorage.getItem('fleet_duress_pin');

  const [isLocked, setIsLocked] = useState(!!accessPin);
  const [pinInput, setPinInput] = useState('');

  const handlePinInput = (val) => {
    const newPin = pinInput + val;
    setPinInput(newPin);

    if (newPin === accessPin) {
      setIsLocked(false);
    } else if (newPin === duressPin) {
      // DURESS TRIGGER: Wipe everything and hard reload
      localStorage.clear();
      window.location.reload();
    } else if (newPin.length >= Math.max(accessPin?.length || 4, duressPin?.length || 4)) {
      // Wrong PIN max length reached, clear it
      setTimeout(() => setPinInput(''), 200);
    }
  };

  if (isLocked) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#fff', userSelect: 'none' }}>
        <h2 style={{ marginBottom: '30px', color: 'var(--accent, #3b82f6)', letterSpacing: '4px' }}>LOCKED</h2>
        <div style={{ fontSize: '2.5em', letterSpacing: '15px', marginBottom: '50px', height: '40px', color: '#fff' }}>
          {'*'.repeat(pinInput.length)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <button key={n} onClick={() => handlePinInput(n.toString())} style={{ width: '75px', height: '75px', fontSize: '1.8em', background: '#111', color: '#fff', border: '1px solid #333', borderRadius: '50%' }}>{n}</button>
          ))}
          <button onClick={() => setPinInput('')} style={{ width: '75px', height: '75px', fontSize: '1.2em', background: '#111', color: '#ef4444', border: '1px solid #333', borderRadius: '50%' }}>CLR</button>
          <button onClick={() => handlePinInput('0')} style={{ width: '75px', height: '75px', fontSize: '1.8em', background: '#111', color: '#fff', border: '1px solid #333', borderRadius: '50%' }}>0</button>
          <div />
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="app-container">
        <CalendarProvider>
          <Router>
            <GlobalNav />
            <Suspense fallback={<div style={{ padding: '20px', color: '#fff', textAlign: 'center' }}>Loading Module...</div>}>
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
                <Route path="/vault" element={<Vault />} />

                {/* Calculators */}
                <Route path="/calculator" element={<CalculatorHub />} />
                <Route path="/calculator/timesheet" element={<TimesheetCalc />} />
                <Route path="/calculator/tax" element={<TaxCalc />} />
                <Route path="/calculator/solar" element={<SolarCalc />} />
                <Route path="/calculator/shooting" element={<ShootingCalc />} />
                <Route path="/calculator/engineering" element={<EngineeringCalc />} />
                <Route path="/calculator/nuclear" element={<NuclearCalc />} />
                <Route path="/calculator/math" element={<MathCalc />} />
                <Route path="/calculator/equations" element={<EquationLibrary />} />
                <Route path="/calculator/lifestyle" element={<LifestyleCalc />} />
                <Route path="/calculator/tech" element={<TechCalc />} />
                <Route path="/calculator/builder" element={<BuilderCalc />} />
                <Route path="/calculator/finance" element={<FinanceCalc />} />

                {/* Standalone Hub Modules */}
                <Route path="/calculator/vehicle" element={<VehicleCalc />} />
                <Route path="/agronomy" element={<AgronomyCalc />} />
                <Route path="/ledger" element={<AssetLedger />} />
                <Route path="/civics" element={<CivicsRights />} />

                <Route path="/quick" element={<QuickCalc />} />
                <Route path="/worldclock" element={<WorldClock />} />
                <Route path="/calendar" element={<CalendarHub />} />
                <Route path="/datavault" element={<DataVault />} />
                <Route path="/subscriptions" element={<SubscriptionTracker />} />
                <Route path="/learning" element={<LearningHub />} />
                <Route path="/myschedule" element={<MyShiftTracker />} />
                <Route path="/keyring" element={<AccessKeyring />} />
                <Route path="/burner" element={<BurnerPad />} />
                <Route path="/sop" element={<TasklistCreator />} />
                <Route path="/chronos" element={<ChronosHub />} />
                <Route path="/budget" element={<BudgetEngine />} />
                <Route path="/support" element={<SupportCreator />} />
                <Route path="/qr-scanner" element={<QRScanner />} />
                <Route path="/morse" element={<MorseBeacon />} />
                <Route path="/cipher" element={<CipherKeygen />} />
                <Route path="/firstaid" element={<FirstAidHub />} />
                <Route path="/mindset" element={<MindsetTracker />} />
              </Routes>
            </Suspense>
          </Router>
        </CalendarProvider>
      </div>
    </ThemeProvider>
  );
}

export default App;
