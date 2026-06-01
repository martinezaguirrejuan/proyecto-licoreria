import { NavLink } from 'react-router-dom'

function Sidebar() {
  const activo = 'bg-gray-700 px-4 py-2 rounded'
  const inactivo = 'px-4 py-2 rounded hover:bg-gray-800'

  return (
    <div className="w-56 min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="p-6 text-xl font-bold border-b border-gray-700">
        Licorería
      </div>
      <nav className="flex flex-col p-4 gap-2">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? activo : inactivo}>Dashboard</NavLink>
        <NavLink to="/productos" className={({ isActive }) => isActive ? activo : inactivo}>Productos</NavLink>
        <NavLink to="/clientes" className={({ isActive }) => isActive ? activo : inactivo}>Clientes</NavLink>
        <NavLink to="/proveedores" className={({ isActive }) => isActive ? activo : inactivo}>Proveedores</NavLink>
        <NavLink to="/empleados" className={({ isActive }) => isActive ? activo : inactivo}>Empleados</NavLink>
        <NavLink to="/ventas" className={({ isActive }) => isActive ? activo : inactivo}>Ventas</NavLink>
        <NavLink to="/compras" className={({ isActive }) => isActive ? activo : inactivo}>Compras</NavLink>
      </nav>
    </div>
  )
}

export default Sidebar
