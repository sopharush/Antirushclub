import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ReadyProvider } from './lib/ReadyContext'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ReadyProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </ReadyProvider>
  </React.StrictMode>,
)
