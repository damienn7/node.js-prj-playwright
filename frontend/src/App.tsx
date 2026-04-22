import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Analyses from './pages/Analyses'
import AnalysisDetail from './pages/AnalysisDetail'
import Sidebar from './components/Sidebar'

export default function App() {
  return (
    <div className="app-root">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analyses" element={<Analyses />} />
          <Route path="/analyses/:id" element={<AnalysisDetail />} />
          <Route path="*" element={<div>Not Found — <Link to="/">Go home</Link></div>} />
        </Routes>
      </main>
    </div>
  )
}
