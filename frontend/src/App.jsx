import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AddTask from './pages/AddTask';
import { ToastProvider } from './components/Toast';

export default function App() {
  // Initialize dark mode from localStorage or system preference
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    // Fallback to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Toggle class on document and body on mode change
  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;
    
    if (darkMode) {
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
    }
    
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <ToastProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
          {/* Main header navbar */}
          <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          
          {/* Main layout container */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/add-task" element={<AddTask />} />
            </Routes>
          </main>
          
          {/* Footer */}
          <footer className="py-6 text-center text-xs text-slate-400 dark:text-slate-650 border-t border-slate-200/40 dark:border-slate-900/60 bg-white/40 dark:bg-slate-950/40 backdrop-blur-xs">
            <p>© {new Date().getFullYear()} Mini Project Management Portal. All rights reserved.</p>
          </footer>
        </div>
      </Router>
    </ToastProvider>
  );
}
