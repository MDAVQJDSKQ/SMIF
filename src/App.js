import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import FMPVisualizer from './components/FMPVisualizer';
import FMPScraper from './components/FMPScraper';
import SlidingCorrelation from './components/SlidingCorrelation';
import './App.css';

function App() {
  return (
    <Router>
      <div className="container">
        <Navigation />
        <Routes>
          <Route path="/SMIF" element={<Navigate to="/visualizer" replace />} />
          <Route path="/visualizer" element={<FMPVisualizer />} />
          <Route path="/scraper" element={<FMPScraper />} />
          <Route path="/sliding" element={<SlidingCorrelation />} />
          <Route path="*" element={<Navigate to="/visualizer" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;