import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider } from './core/ThemeContext';
import './App.css';

const Dashboard = lazy(() => import('./views/Dashboard'));
const Settings = lazy(() => import('./views/Settings'));
const CalculatorHub = lazy(() => import('./views/CalculatorHub'));
// ... (keep previous imports)
const Vault = lazy(() => import('./views/Vault'));
const PdfReader = lazy(() => import('./views/PdfReader'));

// ... (keep GlobalNav and App routes)
// Add these to Routes:
// <Route path="/vault" element={<Vault />} />
// <Route path="/vault/view/:fileName" element={<PdfReader />} />
