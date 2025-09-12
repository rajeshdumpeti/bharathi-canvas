import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import App from './app/App';
import './styles/index.css';

// Use HashRouter in production (GitHub Pages), BrowserRouter in dev
const Router =
  process.env.NODE_ENV === 'production' ? HashRouter : BrowserRouter;

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
