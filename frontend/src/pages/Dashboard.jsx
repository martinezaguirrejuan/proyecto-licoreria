import { useEffect, useState } from 'react'

function Dashboard() {
  const [datos, setDatos] = useState(null)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/dashboard`)
      .then(res => res.json())
      .then(data => setDatos(data))
  }, [])

  if (!datos) return <div className="p-8 text-gray-500">Cargando...</div>

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-5 border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Ventas hoy</p>
          <p className="text-2xl font-bold">${Number(datos.ventasHoy.total).toLocaleString()}</p>
          <p className="text-sm text-gray-400">{datos.ventasHoy.cantidad} transacciones</p>
        </div>
        <div className="bg-white rounded-lg shadow p-5 border-l-4 border-blue-500">
          <p className="text-sm text-gray-500">Ventas este mes</p>
          <p className="text-2xl font-bold">${Number(datos.ventasMes.total).toLocaleString()}</p>
          <p className="text-sm text-gray-400">{datos.ventasMes.cantidad} transacciones</p>
        </div>
        <div className="bg-white rounded-lg shadow p-5 border-l-4 border-purple-500">
          <p className="text-sm text-gray-500">Clientes registrados</p>
          <p className="text-2xl font-bold">{datos.totalClientes}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-5 border-l-4 border-orange-500">
          <p className="text-sm text-gray-500">Productos</p>
          <p className="text-2xl font-bold">{datos.totalProductos}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-lg font-bold mb-4 text-red-600">Productos con stock bajo o agotado</h2>
          {datos.stockBajo.length === 0
            ? <p className="text-gray-400">Todos los productos tienen stock suficiente</p>
            : <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Producto</th>
                    <th className="p-2 text-right">Stock actual</th>
                    <th className="p-2 text-right">Mínimo</th>
                    <th className="p-2 text-left">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {datos.stockBajo.map(p => (
                    <tr key={p.id_producto} className="border-t">
                      <td className="p-2">{p.nombre}</td>
                      <td className="p-2 text-right font-semibold">{p.stock_actual}</td>
                      <td className="p-2 text-right">{p.stock_minimo}</td>
                      <td className="p-2">
                        {p.stock_actual <= 0
                          ? <span className="text-red-600 font-semibold">Agotado</span>
                          : <span className="text-orange-500 font-semibold">Stock bajo</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          }
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-lg font-bold mb-4">Últimas ventas</h2>
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">#</th>
                <th className="p-2 text-left">Cliente</th>
                <th className="p-2 text-left">Método</th>
                <th className="p-2 text-right">Total</th>
                <th className="p-2 text-left">Estado</th>
              </tr>
            </thead>
            <tbody>
              {datos.ultimasVentas.map(v => (
                <tr key={v.id_venta} className="border-t">
                  <td className="p-2">{v.id_venta}</td>
                  <td className="p-2">{v.nombre_cliente || 'Sin cliente'}</td>
                  <td className="p-2">{v.metodo_pago}</td>
                  <td className="p-2 text-right font-semibold">${Number(v.total_venta).toLocaleString()}</td>
                  <td className="p-2">
                    <span className={v.estado === 'Completada' ? 'text-green-600' : v.estado === 'Cancelada' ? 'text-red-500' : 'text-orange-500'}>
                      {v.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
