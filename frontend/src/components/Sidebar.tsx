import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <h2>Product Intelligence AI</h2>
        <p className="slogan">Product insights, instantly</p>
      </div>
      <nav className="nav">
        <NavLink to="/" end className={({isActive})=>isActive? 'nav-link active':'nav-link'}>Dashboard</NavLink>
        <NavLink to="/analyses" className={({isActive})=>isActive? 'nav-link active':'nav-link'}>Analyses</NavLink>
      </nav>
    </aside>
  )
}
