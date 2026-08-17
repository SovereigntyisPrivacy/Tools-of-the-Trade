import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './core/ThemeContext';
import './App.css';

const Dashboard = lazy(() => import('./views/Dashboard'));
const Settings = lazy(() => import('./views/Settings'));

function App() {
  return (
    <ThemeProvider>
      <div className="app-container">
        <Router>
          <Suspense fallback={<div className="loading-screen">Loading Tools of the Trade...</div>}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Suspense>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;

