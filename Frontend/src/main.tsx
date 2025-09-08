import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

// Μόνο το BrowserRouter τυλίγει το App. Όλες οι διαδρομές ορίζονται πλέον μέσα στο App.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);