import { useState } from 'react'
import { NavLink } from 'react-router-dom'

function Sidebar() {
  const [open, setOpen] = useState(false)
  const activo = 'bg-gray-700 px-4 py-2 rounded'
  const inactivo = 'px-4 py-2 rounded hover:bg-gray-800'

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white flex items-center px-4 py-3 shadow">
        <button onClick={() => setOpen(true)} className="mr-4 text-2xl leading-none">☰</button>
        <span className="text-xl font-bold">Licorería</span>
      </div>

      {open && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setOpen(false)} />
      )}

      <div className={`fixed md:static top-0 left-0 h-full z-50 w-56 min-h-screen bg-gray-900 text-white flex flex-col transition-transform duration-300 md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 text-xl font-bold border-b border-gray-700 flex justify-between items-center">
          <span>Licorería</span>
          <button onClick={() => setOpen(false)} className="md:hidden text-gray-400 hover:text-white text-base">✕</button>
        </div>
        <nav className="flex flex-col p-4 gap-2">
          <NavLink to="/dashboard" onClick={() => setOpen(false)} className={({ isActive }) => isActive ? activo : inactivo}>Dashboard</NavLink>
          <NavLink to="/productos" onClick={() => setOpen(false)} className={({ isActive }) => isActive ? activo : inactivo}>Productos</NavLink>
          <NavLink to="/clientes" onClick={() => setOpen(false)} className={({ isActive }) => isActive ? activo : inactivo}>Clientes</NavLink>
          <NavLink to="/proveedores" onClick={() => setOpen(false)} className={({ isActive }) => isActive ? activo : inactivo}>Proveedores</NavLink>
          <NavLink to="/empleados" onClick={() => setOpen(false)} className={({ isActive }) => isActive ? activo : inactivo}>Empleados</NavLink>
          <NavLink to="/ventas" onClick={() => setOpen(false)} className={({ isActive }) => isActive ? activo : inactivo}>Ventas</NavLink>
          <NavLink to="/compras" onClick={() => setOpen(false)} className={({ isActive }) => isActive ? activo : inactivo}>Compras</NavLink>
          <NavLink to="/reportes" onClick={() => setOpen(false)} className={({ isActive }) => isActive ? activo : inactivo}>Reportes</NavLink>
        </nav>
      </div>
    </>
  )
}

export default Sidebar
