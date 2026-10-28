import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ReadyProvider } from './lib/ReadyContext'
import App from './App'
import './index.css'

// Loaded only on /admin, so the public site never ships the dashboard code.
const Admin = lazy(() => import('./admin/Admin'))

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ReadyProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route
            path="/admin"
            element={
              <Suspense fallback={<main className="min-h-screen bg-cream" />}>
                <Admin />
              </Suspense>
            }
          />
          <Route path="*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </ReadyProvider>
  </React.StrictMode>,
)
