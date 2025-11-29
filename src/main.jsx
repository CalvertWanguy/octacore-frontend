import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.simple.css'
import App from './App.jsx'
import "@fontsource/poppins"; // poids par défaut 400
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
