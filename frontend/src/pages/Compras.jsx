import React, { useEffect, useState } from 'react'

function Compras() {
  const [compras, setCompras] = useState([])
  const [proveedores, setProveedores] = useState([])
  const [productos, setProductos] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [detalleAbierto, setDetalleAbierto] = useState(null)
  const [detalle, setDetalle] = useState([])
  const [compraEditando, setCompraEditando] = useState(null)
  const [estadoEditar, setEstadoEditar] = useState('')

  const [form, setForm] = useState({
    nit_proveedor: '',
    fecha_compra: '',
    estado: 'Completada'
  })

  const [carrito, setCarrito] = useState([])
  const [productoSeleccionado, setProductoSeleccionado] = useState('')
  const [cantidad, setCantidad] = useState(1)
  const [precioUnitario, setPrecioUnitario] = useState('')

  const cargarCompras = () => {
    fetch(`${import.meta.env.VITE_API_URL}/compras`)
      .then(res => res.json())
      .then(data => setCompras(data))
  }

  useEffect(() => {
    cargarCompras()
    fetch(`${import.meta.env.VITE_API_URL}/proveedores`).then(res => res.json()).then(data => setProveedores(data))
    fetch(`${import.meta.env.VITE_API_URL}/productos`).then(res => res.json()).then(data => setProductos(data))
  }, [])

  const agregarAlCarrito = () => {
    if (!productoSeleccionado || cantidad < 1 || !precioUnitario) return

    const producto = productos.find(p => p.id_producto === parseInt(productoSeleccionado))
    if (!producto) return

    const subtotal = parseFloat(precioUnitario) * cantidad

    const itemExistente = carrito.find(item => item.id_producto === producto.id_producto)
    if (itemExistente) {
      setCarrito(carrito.map(item =>
        item.id_producto === producto.id_producto
          ? { ...item, cantidad: item.cantidad + cantidad, subtotal: item.subtotal + subtotal }
          : item
      ))
    } else {
      setCarrito([...carrito, {
        id_producto: producto.id_producto,
        nombre_producto: producto.nombre,
        precio_unitario: parseFloat(precioUnitario),
        cantidad,
        subtotal
      }])
    }

    setProductoSeleccionado('')
    setCantidad(1)
    setPrecioUnitario('')
  }

  const quitarDelCarrito = (id_producto) => {
    setCarrito(carrito.filter(item => item.id_producto !== id_producto))
  }

  const total = carrito.reduce((acc, item) => acc + item.subtotal, 0)

  const guardarCompra = () => {
    if (!form.nit_proveedor) { alert('Debes seleccionar un proveedor'); return }
    if (!form.fecha_compra) { alert('Debes ingresar la fecha de compra'); return }
    if (carrito.length === 0) { alert('Agrega al menos un producto'); return }

    const body = {
      ...form,
      total_compra: total,
      items: carrito.map(item => ({
        id_producto: item.id_producto,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
        subtotal: item.subtotal
      }))
    }

    fetch(`${import.meta.env.VITE_API_URL}/compras`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) { alert('Error: ' + data.error); return }
        setMostrarFormulario(false)
        setCarrito([])
        setForm({ nit_proveedor: '', fecha_compra: '', estado: 'Completada' })
        cargarCompras()
      })
  }

  const verDetalle = (id) => {
    if (detalleAbierto === id) { setDetalleAbierto(null); setDetalle([]); return }
    fetch(`${import.meta.env.VITE_API_URL}/compras/${id}/detalle`)
      .then(res => res.json())
      .then(data => { setDetalle(data); setDetalleAbierto(id) })
  }

  const guardarEdicion = (id) => {
    fetch(`${import.meta.env.VITE_API_URL}/compras/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: estadoEditar })
    })
      .then(res => res.json())
      .then(() => { setCompraEditando(null); cargarCompras() })
  }

  const eliminarCompra = (id) => {
    fetch(`${import.meta.env.VITE_API_URL}/compras/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => cargarCompras())
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Compras</h1>

      <button
        onClick={() => {
          setMostrarFormulario(true)
          setCarrito([])
          fetch(`${import.meta.env.VITE_API_URL}/productos`).then(res => res.json()).then(data => setProductos(data))
        }}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        + Nueva compra
      </button>

      {mostrarFormulario && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4">Nueva compra</h2>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <select value={form.nit_proveedor} className="border p-2 rounded" onChange={e => setForm({...form, nit_proveedor: e.target.value})}>
              <option value="">-- Proveedor --</option>
              {proveedores.map(p => (
                <option key={p.nit} value={p.nit}>{p.nombre_empresa}</option>
              ))}
            </select>
            <input type="date" value={form.fecha_compra} className="border p-2 rounded" onChange={e => setForm({...form, fecha_compra: e.target.value})} />
            <select value={form.estado} className="border p-2 rounded" onChange={e => setForm({...form, estado: e.target.value})}>
              <option value="Completada">Completada</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </div>

          <div className="border-t pt-4 mb-4">
            <p className="font-semibold mb-2">Agregar productos:</p>
            <div className="flex gap-2">
              <select value={productoSeleccionado} className="border p-2 rounded flex-1" onChange={e => setProductoSeleccionado(e.target.value)}>
                <option value="">-- Seleccionar producto --</option>
                {productos.map(p => (
                  <option key={p.id_producto} value={p.id_producto}>{p.nombre}</option>
                ))}
              </select>
              <input type="number" min="1" placeholder="Cantidad" value={cantidad} onChange={e => setCantidad(parseInt(e.target.value))} className="border p-2 rounded w-28" />
              <input type="number" min="0" placeholder="Precio unitario" value={precioUnitario} onChange={e => setPrecioUnitario(e.target.value)} className="border p-2 rounded w-36" />
              <button onClick={agregarAlCarrito} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Agregar</button>
            </div>
          </div>

          {carrito.length > 0 && (
            <div className="mb-4">
              <table className="w-full border rounded">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Producto</th>
                    <th className="p-2 text-right">Precio unitario</th>
                    <th className="p-2 text-right">Cantidad</th>
                    <th className="p-2 text-right">Subtotal</th>
                    <th className="p-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {carrito.map(item => (
                    <tr key={item.id_producto} className="border-t">
                      <td className="p-2">{item.nombre_producto}</td>
                      <td className="p-2 text-right">${Number(item.precio_unitario).toLocaleString()}</td>
                      <td className="p-2 text-right">{item.cantidad}</td>
                      <td className="p-2 text-right">${Number(item.subtotal).toLocaleString()}</td>
                      <td className="p-2 text-right">
                        <button onClick={() => quitarDelCarrito(item.id_producto)} className="text-red-500 hover:text-red-700">✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-right font-bold text-lg mt-2">Total: ${Number(total).toLocaleString()}</p>
            </div>
          )}

          <div className="flex gap-2">
            <button onClick={guardarCompra} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Guardar compra</button>
            <button onClick={() => { setMostrarFormulario(false); setCarrito([]) }} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">Cancelar</button>
          </div>
        </div>
      )}

      <table className="w-full bg-white rounded-lg shadow">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="p-3 text-left">#</th>
            <th className="p-3 text-left">Fecha</th>
            <th className="p-3 text-left">Proveedor</th>
            <th className="p-3 text-left">Estado</th>
            <th className="p-3 text-right">Total</th>
            <th className="p-3 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {compras.map(c => (
            <React.Fragment key={c.id_compra}>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3">{c.id_compra}</td>
                <td className="p-3">{new Date(c.fecha_compra).toLocaleDateString('es-CO')}</td>
                <td className="p-3">{c.nombre_proveedor}</td>
                <td className="p-3">
                  {compraEditando === c.id_compra
                    ? <select value={estadoEditar} className="border p-1 rounded" onChange={e => setEstadoEditar(e.target.value)}>
                        <option value="Completada">Completada</option>
                        <option value="Pendiente">Pendiente</option>
                        <option value="Cancelada">Cancelada</option>
                      </select>
                    : c.estado}
                </td>
                <td className="p-3 text-right font-semibold">${Number(c.total_compra).toLocaleString()}</td>
                <td className="p-3 flex gap-2">
                  {compraEditando === c.id_compra
                    ? <>
                        <button onClick={() => guardarEdicion(c.id_compra)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Guardar</button>
                        <button onClick={() => setCompraEditando(null)} className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500">Cancelar</button>
                      </>
                    : <>
                        <button onClick={() => verDetalle(c.id_compra)} className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700">Detalle</button>
                        <button onClick={() => { setCompraEditando(c.id_compra); setEstadoEditar(c.estado) }} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Editar estado</button>
                      </>}
                </td>
              </tr>
              {detalleAbierto === c.id_compra && (
                <tr className="bg-gray-50">
                  <td colSpan="6" className="p-4">
                    <p className="font-semibold mb-2">Productos de la compra #{c.id_compra}:</p>
                    <table className="w-full border rounded text-sm">
                      <thead className="bg-gray-200">
                        <tr>
                          <th className="p-2 text-left">Producto</th>
                          <th className="p-2 text-right">Precio unitario</th>
                          <th className="p-2 text-right">Cantidad</th>
                          <th className="p-2 text-right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detalle.map(d => (
                          <tr key={d.id_detalle_compra} className="border-t">
                            <td className="p-2">{d.nombre_producto}</td>
                            <td className="p-2 text-right">${Number(d.precio_unitario).toLocaleString()}</td>
                            <td className="p-2 text-right">{d.cantidad}</td>
                            <td className="p-2 text-right">${Number(d.subtotal).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Compras
