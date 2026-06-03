import { useState } from 'react'
import { NavLink } from 'react-router-dom'

function Sidebar({ usuario, onLogout }) {
  const [open, setOpen] = useState(false)
  const activo = 'bg-gray-700 px-4 py-2 rounded'
  const inactivo = 'px-4 py-2 rounded hover:bg-gray-800'
  const links = [                                                               
      { to: '/dashboard', label: 'Dashboard', roles: ['admin', 'vendedor',      
  'bodega'] },
      { to: '/productos', label: 'Productos', roles: ['admin', 'bodega'] },     
      { to: '/clientes', label: 'Clientes', roles: ['admin', 'vendedor'] },     
      { to: '/proveedores', label: 'Proveedores', roles: ['admin'] },
      { to: '/empleados', label: 'Empleados', roles: ['admin'] },               
      { to: '/ventas', label: 'Ventas', roles: ['admin', 'vendedor'] },       
      { to: '/compras', label: 'Compras', roles: ['admin', 'bodega'] },         
      { to: '/reportes', label: 'Reportes', roles: ['admin'] },               
  ]                         

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
          {links
            .filter(link => link.roles.includes(usuario?.rol))
            .map(link => (
              <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)} className={({ isActive }) => isActive ? activo : inactivo}>
                {link.label}
              </NavLink>
            ))
          }
        </nav>
        <div className="mt-auto p-4 border-t border-gray-700">
          <p className="text-sm text-gray-400 mb-2">{usuario?.nombre}</p>
          <button onClick={onLogout} className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 text-sm">
            Cerrar sesión
          </button>
        </div>
      </div>
    </>
  )
}

export default Sidebar
