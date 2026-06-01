import { useEffect, useState } from 'react'

function Productos() {
  const [productos, setProductos] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [form, setForm] = useState({ nombre: '', tipo_licor: '', marca: '', categoria: '', contenido_ml: '', precio_compra: '', precio_venta: '', stock_actual: '', stock_minimo: '' })
  const [productoEditando, setProductoEditando] = useState(null)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/productos`)
      .then(res => res.json())
      .then(data => setProductos(data))
  }, [])

  const guardarProducto = () => {
    const url = productoEditando
      ? `${import.meta.env.VITE_API_URL}/productos/${productoEditando}`
      : `${import.meta.env.VITE_API_URL}/productos`
    const method = productoEditando ? 'PUT' : 'POST'

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(() => {
        setMostrarFormulario(false)
        setProductoEditando(null)
        fetch(`${import.meta.env.VITE_API_URL}/productos`)
          .then(res => res.json())
          .then(data => setProductos(data))
      })
  }

  const eliminarProducto = (id) => {
    fetch(`${import.meta.env.VITE_API_URL}/productos/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => {
        fetch(`${import.meta.env.VITE_API_URL}/productos`)
          .then(res => res.json())
          .then(data => setProductos(data))
      })
  }

  const editarProducto = (p) => {
    setProductoEditando(p.id_producto)
    setMostrarFormulario(true)
    setForm({ nombre: p.nombre, tipo_licor: p.tipo_licor, marca: p.marca, categoria: p.categoria, contenido_ml: p.contenido_ml, precio_compra: p.precio_compra, precio_venta: p.precio_venta, stock_actual: p.stock_actual, stock_minimo: p.stock_minimo })
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Productos</h1>

      <button
        onClick={() => { setMostrarFormulario(true); setProductoEditando(null) }}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        + Agregar producto
      </button>

      {mostrarFormulario && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4">{productoEditando ? 'Editar producto' : 'Nuevo producto'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input placeholder="Nombre" value={form.nombre} className="border p-2 rounded" onChange={e => setForm({...form, nombre: e.target.value})} />
            <select value={form.tipo_licor} className="border p-2 rounded" onChange={e => setForm({...form, tipo_licor: e.target.value})}>
              <option value="">Tipo licor</option>
              <option>Whisky</option>
              <option>Ron</option>
              <option>Vodka</option>
              <option>Cerveza</option>
              <option>Vino</option>
              <option>Aguardiente</option>
              <option>Tequila</option>
              <option>Ginebra</option>
              <option>Brandy</option>
              <option>Otro</option>
            </select>
            <input placeholder="Marca" value={form.marca} className="border p-2 rounded" onChange={e => setForm({...form, marca: e.target.value})} />
            <select value={form.categoria} className="border p-2 rounded" onChange={e => setForm({...form, categoria: e.target.value})}>
              <option value="">Categoría</option>
              <option>Importado</option>
              <option>Nacional</option>
              <option>Artesanal</option>
            </select>
            <input placeholder="Contenido ml" type="number" value={form.contenido_ml} className="border p-2 rounded" onChange={e => setForm({...form, contenido_ml: e.target.value})} />
            <input placeholder="Precio compra" type="number" value={form.precio_compra} className="border p-2 rounded" onChange={e => setForm({...form, precio_compra: e.target.value})} />
            <input placeholder="Precio venta" type="number" value={form.precio_venta} className="border p-2 rounded" onChange={e => setForm({...form, precio_venta: e.target.value})} />
            <input placeholder="Stock actual" type="number" value={form.stock_actual} className="border p-2 rounded" onChange={e => setForm({...form, stock_actual: e.target.value})} />
            <input placeholder="Stock mínimo" type="number" value={form.stock_minimo} className="border p-2 rounded" onChange={e => setForm({...form, stock_minimo: e.target.value})} />
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={guardarProducto} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Guardar</button>
            <button onClick={() => { setMostrarFormulario(false); setProductoEditando(null) }} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">Cancelar</button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
      <table className="w-full bg-white rounded-lg shadow">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="p-3 text-left">Nombre</th>
            <th className="p-3 text-left">Tipo</th>
            <th className="p-3 text-left">Marca</th>
            <th className="p-3 text-left">Categoría</th>
            <th className="p-3 text-left">Precio venta</th>
            <th className="p-3 text-left">Stock</th>
            <th className="p-3 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(p => (
            <tr key={p.id_producto} className="border-b hover:bg-gray-50">
              <td className="p-3">{p.nombre}</td>
              <td className="p-3">{p.tipo_licor}</td>
              <td className="p-3">{p.marca}</td>
              <td className="p-3">{p.categoria}</td>
              <td className="p-3">${Number(p.precio_venta).toLocaleString()}</td>
              <td className="p-3">{p.stock_actual}</td>
              <td className="p-3 flex gap-2">
                <button
                  onClick={() => editarProducto(p)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => eliminarProducto(p.id_producto)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}

export default Productos
