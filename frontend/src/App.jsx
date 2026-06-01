import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Productos from './pages/Productos'
import Clientes from './pages/Clientes'
import Proveedores from './pages/Proveedores'
import Empleados from './pages/Empleados'

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Navigate to="/productos" />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/proveedores" element={<Proveedores />} />
            <Route path="/empleados" element={<Empleados />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
