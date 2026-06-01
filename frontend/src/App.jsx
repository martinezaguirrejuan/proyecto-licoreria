import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Productos from './pages/Productos'
import Clientes from './pages/Clientes'
import Proveedores from './pages/Proveedores'
import Empleados from './pages/Empleados'
import Ventas from './pages/Ventas'
import Compras from './pages/Compras'
import Dashboard from './pages/Dashboard'
import Reportes from './pages/Reportes'

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gray-100 overflow-x-hidden">
        <Sidebar />
        <div className="flex-1 min-w-0 pt-12 md:pt-0">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/proveedores" element={<Proveedores />} />
            <Route path="/empleados" element={<Empleados />} />
            <Route path="/ventas" element={<Ventas />} />
            <Route path="/compras" element={<Compras />} />
            <Route path="/reportes" element={<Reportes />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
