import { useEffect, useRef, useState } from 'react'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const COLORES_PIE = ['#4f46e5', '#16a34a', '#dc2626', '#d97706', '#0891b2']

function Reportes() {
  const reporteRef = useRef(null)
  const [ventasDia, setVentasDia] = useState([])
  const [masVendidos, setMasVendidos] = useState([])
  const [porMetodo, setPorMetodo] = useState([])
  const [ingresosVsCostos, setIngresosVsCostos] = useState([])

  useEffect(() => {
    const base = import.meta.env.VITE_API_URL
    fetch(`${base}/reportes/ventas-por-dia`).then(r => r.json()).then(setVentasDia)
    fetch(`${base}/reportes/productos-mas-vendidos`).then(r => r.json()).then(setMasVendidos)
    fetch(`${base}/reportes/ventas-por-metodo`).then(r => r.json()).then(setPorMetodo)
    fetch(`${base}/reportes/ingresos-vs-costos`).then(r => r.json()).then(setIngresosVsCostos)
  }, [])

  const formatPeso = (valor) => `$${Number(valor).toLocaleString('es-CO')}`

  const ventasDiaFormato = ventasDia.map(v => ({
    ...v,
    dia: new Date(v.dia + 'T12:00:00').toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric' }),
    total: Number(v.total)
  }))

  const masVendidosFormato = masVendidos.map(v => ({
    ...v,
    unidades: Number(v.unidades)
  }))

  const ingresosFormato = ingresosVsCostos.map(v => ({
    ...v,
    mes: v.mes.substring(5) + '/' + v.mes.substring(0, 4)
  }))

  const descargarPDF = () => {
    window.print()
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Reportes</h1>
        <button onClick={descargarPDF} className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900">
          Descargar PDF
        </button>
      </div>

      <div ref={reporteRef} className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Ventas últimos 7 días */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Ventas últimos 7 días</h2>
          {ventasDiaFormato.length === 0
            ? <p className="text-gray-400 text-sm">Sin datos</p>
            : <ResponsiveContainer width="100%" height={250}>
                <LineChart data={ventasDiaFormato}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dia" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={v => `$${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(val) => formatPeso(val)} />
                  <Line type="monotone" dataKey="total" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} name="Total ventas" />
                </LineChart>
              </ResponsiveContainer>
          }
        </div>

        {/* TOP 5 productos más vendidos */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Top 5 productos más vendidos</h2>
          {masVendidosFormato.length === 0
            ? <p className="text-gray-400 text-sm">Sin datos</p>
            : <ResponsiveContainer width="100%" height={250}>
                <BarChart data={masVendidosFormato} layout="vertical" margin={{ left: 10, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="nombre" width={110} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="unidades" fill="#16a34a" name="Unidades vendidas" />
                </BarChart>
              </ResponsiveContainer>
          }
        </div>

        {/* Ventas por método de pago */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Ventas por método de pago</h2>
          {porMetodo.length === 0
            ? <p className="text-gray-400 text-sm">Sin datos</p>
            : <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={porMetodo}
                    dataKey="cantidad"
                    nameKey="metodo_pago"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ metodo_pago, percent }) => `${metodo_pago} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {porMetodo.map((_, i) => (
                      <Cell key={i} fill={COLORES_PIE[i % COLORES_PIE.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val, name) => [val + ' ventas', name]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
          }
        </div>

        {/* Ingresos vs Costos por mes */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Ingresos vs Costos (últimos 6 meses)</h2>
          {ingresosFormato.length === 0
            ? <p className="text-gray-400 text-sm">Sin datos</p>
            : <ResponsiveContainer width="100%" height={250}>
                <BarChart data={ingresosFormato}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={v => `$${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(val) => formatPeso(val)} />
                  <Legend />
                  <Bar dataKey="ventas" fill="#4f46e5" name="Ventas" />
                  <Bar dataKey="compras" fill="#dc2626" name="Compras" />
                </BarChart>
              </ResponsiveContainer>
          }
        </div>

      </div>
    </div>
  )
}

export default Reportes
