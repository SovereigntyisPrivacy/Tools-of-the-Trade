import React, { Suspense, lazy } from 'react';
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
const SOPEngine = lazy(() => import('./views/SOPEngine'));
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
const CivicsRights = lazy(() => import("./views/CivicsRights"));

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
        <CalendarProvider>
      <Router>
          <GlobalNav />
          <Suspense fallback={<div className="loading-screen" style={{ color: '#fff', textAlign: 'center', paddingTop: '50px' }}>Loading Module...</div>}>
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
        <Route path="/vehicle" element={<VehicleCalc />} />
              <Route path="/calculator/agronomy" element={<AgronomyCalc />} />
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
          <Route path="/sop" element={<SOPEngine />} />
          <Route path="/chronos" element={<ChronosHub />} />
          <Route path="/budget" element={<BudgetEngine />} />
          <Route path="/support" element={<SupportCreator />} />
        <Route path="/qr-scanner" element={<QRScanner />} />
        </Routes>
          </Suspense>
        </Router>
      </CalendarProvider>
      </div>
    </ThemeProvider>
  );
}

export default App;
