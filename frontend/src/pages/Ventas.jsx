import React, { useEffect, useState } from 'react'

function Ventas() {
  const [ventas, setVentas] = useState([])
  const [clientes, setClientes] = useState([])
  const [empleados, setEmpleados] = useState([])
  const [productos, setProductos] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [ventaEditando, setVentaEditando] = useState(null)
  const [formEditar, setFormEditar] = useState({ estado: '', metodo_pago: '' })
  const [detalleAbierto, setDetalleAbierto] = useState(null)
  const [detalle, setDetalle] = useState([])

  const [form, setForm] = useState({
    cedula_cliente: '',
    cedula_empleado: '',
    metodo_pago: '',
    estado: 'Completada'
  })

  const [carrito, setCarrito] = useState([])
  const [productoSeleccionado, setProductoSeleccionado] = useState('')
  const [cantidad, setCantidad] = useState(1)

  const cargarVentas = () => {
    fetch(`${import.meta.env.VITE_API_URL}/ventas`)
      .then(res => res.json())
      .then(data => setVentas(data))
  }

  useEffect(() => {
    cargarVentas()
    fetch(`${import.meta.env.VITE_API_URL}/clientes`).then(res => res.json()).then(data => setClientes(data))
    fetch(`${import.meta.env.VITE_API_URL}/empleados`).then(res => res.json()).then(data => setEmpleados(data))
    fetch(`${import.meta.env.VITE_API_URL}/productos`).then(res => res.json()).then(data => setProductos(data))
  }, [])

  const agregarAlCarrito = () => {
    if (!productoSeleccionado || cantidad < 1) return

    const producto = productos.find(p => p.id_producto === parseInt(productoSeleccionado))
    if (!producto) return

    if (cantidad > producto.stock_actual) {
      alert(`Stock insuficiente. Solo hay ${producto.stock_actual} unidades disponibles de ${producto.nombre}.`)
      return
    }

    const subtotal = producto.precio_venta * cantidad

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
        precio_unitario: producto.precio_venta,
        cantidad,
        subtotal
      }])
    }

    setProductoSeleccionado('')
    setCantidad(1)
  }

  const quitarDelCarrito = (id_producto) => {
    setCarrito(carrito.filter(item => item.id_producto !== id_producto))
  }

  const total = carrito.reduce((acc, item) => acc + item.subtotal, 0)

  const guardarVenta = () => {
    if (!form.cedula_empleado) { alert('Debes seleccionar un empleado'); return }
    if (!form.metodo_pago) { alert('Debes seleccionar el método de pago'); return }
    if (carrito.length === 0) { alert('Agrega al menos un producto al carrito'); return }

    const body = {
      ...form,
      cedula_cliente: form.cedula_cliente || null,
      total_venta: total,
      items: carrito.map(item => ({
        id_producto: item.id_producto,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
        descuento: 0,
        subtotal: item.subtotal
      }))
    }

    fetch(`${import.meta.env.VITE_API_URL}/ventas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert('Error: ' + data.error)
          return
        }
        setMostrarFormulario(false)
        setCarrito([])
        setForm({ cedula_cliente: '', cedula_empleado: '', metodo_pago: '', estado: 'Completada' })
        cargarVentas()
      })
  }

  const verDetalle = (id) => {
    if (detalleAbierto === id) {
      setDetalleAbierto(null)
      setDetalle([])
      return
    }
    fetch(`${import.meta.env.VITE_API_URL}/ventas/${id}/detalle`)
      .then(res => res.json())
      .then(data => {
        setDetalle(data)
        setDetalleAbierto(id)
      })
  }

  const guardarEdicion = (id) => {
    fetch(`${import.meta.env.VITE_API_URL}/ventas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formEditar)
    })
      .then(res => res.json())
      .then(() => {
        setVentaEditando(null)
        cargarVentas()
      })
  }

  const eliminarVenta = (id) => {
    fetch(`${import.meta.env.VITE_API_URL}/ventas/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => cargarVentas())
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Ventas</h1>

      <button
        onClick={() => {
        setMostrarFormulario(true)
        setCarrito([])
        fetch(`${import.meta.env.VITE_API_URL}/productos`).then(res => res.json()).then(data => setProductos(data))
      }}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        + Nueva venta
      </button>

      {mostrarFormulario && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4">Nueva venta</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <select value={form.cedula_cliente} className="border p-2 rounded" onChange={e => setForm({...form, cedula_cliente: e.target.value})}>
              <option value="">-- Cliente (opcional) --</option>
              {clientes.map(c => (
                <option key={c.cedula} value={c.cedula}>{c.nombre}</option>
              ))}
            </select>

            <select value={form.cedula_empleado} className="border p-2 rounded" onChange={e => setForm({...form, cedula_empleado: e.target.value})}>
              <option value="">-- Empleado --</option>
              {empleados.map(e => (
                <option key={e.cedula} value={e.cedula}>{e.nombre}</option>
              ))}
            </select>

            <select value={form.metodo_pago} className="border p-2 rounded" onChange={e => setForm({...form, metodo_pago: e.target.value})}>
              <option value="">-- Método de pago --</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Tarjeta">Tarjeta</option>
              <option value="Transferencia">Transferencia</option>
              <option value="Nequi">Nequi</option>
              <option value="Daviplata">Daviplata</option>
            </select>

            <select value={form.estado} className="border p-2 rounded" onChange={e => setForm({...form, estado: e.target.value})}>
              <option value="Completada">Completada</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </div>

          <div className="border-t pt-4 mb-4">
            <p className="font-semibold mb-2">Agregar productos al carrito:</p>
            <div className="flex flex-col gap-2">
              <select value={productoSeleccionado} className="border p-2 rounded w-full" onChange={e => setProductoSeleccionado(e.target.value)}>
                <option value="">-- Seleccionar producto --</option>
                {productos.map(p => (
                  <option key={p.id_producto} value={p.id_producto}>{p.nombre} — ${Number(p.precio_venta).toLocaleString()}</option>
                ))}
              </select>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  min="1"
                  value={cantidad}
                  onChange={e => setCantidad(parseInt(e.target.value))}
                  className="border p-2 rounded col-span-2"
                  placeholder="Cantidad"
                />
                <button onClick={agregarAlCarrito} className="bg-blue-600 text-white px-2 py-2 rounded hover:bg-blue-700">Agregar</button>
              </div>
            </div>
            {productoSeleccionado && (() => {
              const p = productos.find(x => x.id_producto === parseInt(productoSeleccionado))
              if (!p) return null
              if (p.stock_actual <= 0) return <p className="text-red-600 text-sm mt-1">Producto agotado — stock: {p.stock_actual}</p>
              if (p.stock_actual <= p.stock_minimo) return <p className="text-orange-500 text-sm mt-1">Stock bajo — quedan {p.stock_actual} unidades (mínimo: {p.stock_minimo})</p>
              return null
            })()}
          </div>

          {carrito.length > 0 && (
            <div className="mb-4">
              {/* Mobile carrito */}
              <div className="md:hidden space-y-2 mb-2">
                {carrito.map(item => (
                  <div key={item.id_producto} className="flex justify-between items-center border rounded p-2 bg-gray-50">
                    <div>
                      <p className="text-sm font-semibold">{item.nombre_producto}</p>
                      <p className="text-sm text-gray-500">${Number(item.precio_unitario).toLocaleString()} × {item.cantidad} = <strong>${Number(item.subtotal).toLocaleString()}</strong></p>
                    </div>
                    <button onClick={() => quitarDelCarrito(item.id_producto)} className="text-red-500 hover:text-red-700 ml-2 text-lg">✕</button>
                  </div>
                ))}
              </div>
              {/* Desktop carrito */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border rounded">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 text-left">Producto</th>
                      <th className="p-2 text-right">Precio</th>
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
              </div>
              <p className="text-right font-bold text-lg mt-2">Total: ${Number(total).toLocaleString()}</p>
            </div>
          )}

          <div className="flex gap-2">
            <button onClick={guardarVenta} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Guardar venta</button>
            <button onClick={() => { setMostrarFormulario(false); setCarrito([]) }} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">Cancelar</button>
          </div>
        </div>
      )}

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {ventas.map(v => (
          <div key={v.id_venta} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="font-semibold">#{v.id_venta} · {v.nombre_cliente || 'Sin cliente'}</span>
                  <span className={`text-sm font-semibold ${v.estado === 'Completada' ? 'text-green-600' : v.estado === 'Cancelada' ? 'text-red-500' : 'text-orange-500'}`}>{v.estado}</span>
                </div>
                <p className="text-sm text-gray-500">{new Date(v.fecha_venta).toLocaleDateString('es-CO')} · {v.nombre_empleado}</p>
                <p className="text-sm text-gray-500">{v.metodo_pago} · <strong className="text-gray-800">${Number(v.total_venta).toLocaleString()}</strong></p>
              </div>
            </div>
            {ventaEditando === v.id_venta
              ? <div className="mt-3 space-y-2">
                  <select value={formEditar.metodo_pago} className="border p-2 rounded w-full" onChange={e => setFormEditar({...formEditar, metodo_pago: e.target.value})}>
                    <option value="Efectivo">Efectivo</option>
                    <option value="Tarjeta">Tarjeta</option>
                    <option value="Transferencia">Transferencia</option>
                    <option value="Nequi">Nequi</option>
                    <option value="Daviplata">Daviplata</option>
                  </select>
                  <select value={formEditar.estado} className="border p-2 rounded w-full" onChange={e => setFormEditar({...formEditar, estado: e.target.value})}>
                    <option value="Completada">Completada</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Cancelada">Cancelada</option>
                  </select>
                  <div className="flex gap-2">
                    <button onClick={() => guardarEdicion(v.id_venta)} className="bg-green-500 text-white px-3 py-1 rounded text-sm">Guardar</button>
                    <button onClick={() => setVentaEditando(null)} className="bg-gray-400 text-white px-3 py-1 rounded text-sm">Cancelar</button>
                  </div>
                </div>
              : <div className="flex gap-2 mt-2">
                  <button onClick={() => verDetalle(v.id_venta)} className="bg-gray-600 text-white px-3 py-1 rounded text-sm">Detalle</button>
                  <button onClick={() => { setVentaEditando(v.id_venta); setFormEditar({ estado: v.estado, metodo_pago: v.metodo_pago }) }} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">Editar</button>
                  <button onClick={() => eliminarVenta(v.id_venta)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Eliminar</button>
                </div>
            }
            {detalleAbierto === v.id_venta && (
              <div className="mt-3 border-t pt-3">
                <p className="text-sm font-semibold mb-2">Productos:</p>
                {detalle.map(d => (
                  <div key={d.id_detalle_venta} className="flex justify-between text-sm border-b py-1">
                    <span>{d.nombre_producto} x{d.cantidad}</span>
                    <span>${Number(d.subtotal).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
      <table className="w-full bg-white rounded-lg shadow">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="p-3 text-left">#</th>
            <th className="p-3 text-left">Fecha</th>
            <th className="p-3 text-left">Cliente</th>
            <th className="p-3 text-left">Empleado</th>
            <th className="p-3 text-left">Método pago</th>
            <th className="p-3 text-left">Estado</th>
            <th className="p-3 text-right">Total</th>
            <th className="p-3 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map(v => (
            <React.Fragment key={v.id_venta}>
            <tr className="border-b hover:bg-gray-50">
              <td className="p-3">{v.id_venta}</td>
              <td className="p-3">{new Date(v.fecha_venta).toLocaleDateString('es-CO')}</td>
              <td className="p-3">{v.nombre_cliente || 'Sin cliente'}</td>
              <td className="p-3">{v.nombre_empleado}</td>
              <td className="p-3">
                {ventaEditando === v.id_venta
                  ? <select value={formEditar.metodo_pago} className="border p-1 rounded" onChange={e => setFormEditar({...formEditar, metodo_pago: e.target.value})}>
                      <option value="Efectivo">Efectivo</option>
                      <option value="Tarjeta">Tarjeta</option>
                      <option value="Transferencia">Transferencia</option>
                      <option value="Nequi">Nequi</option>
                      <option value="Daviplata">Daviplata</option>
                    </select>
                  : v.metodo_pago}
              </td>
              <td className="p-3">
                {ventaEditando === v.id_venta
                  ? <select value={formEditar.estado} className="border p-1 rounded" onChange={e => setFormEditar({...formEditar, estado: e.target.value})}>
                      <option value="Completada">Completada</option>
                      <option value="Pendiente">Pendiente</option>
                      <option value="Cancelada">Cancelada</option>
                    </select>
                  : v.estado}
              </td>
              <td className="p-3 text-right font-semibold">${Number(v.total_venta).toLocaleString()}</td>
              <td className="p-3 flex gap-2">
                {ventaEditando === v.id_venta
                  ? <>
                      <button onClick={() => guardarEdicion(v.id_venta)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Guardar</button>
                      <button onClick={() => setVentaEditando(null)} className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500">Cancelar</button>
                    </>
                  : <>
                      <button onClick={() => verDetalle(v.id_venta)} className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700">Detalle</button>
                      <button onClick={() => { setVentaEditando(v.id_venta); setFormEditar({ estado: v.estado, metodo_pago: v.metodo_pago }) }} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Editar</button>
                      <button onClick={() => eliminarVenta(v.id_venta)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Eliminar</button>
                    </>}
              </td>
            </tr>
            {detalleAbierto === v.id_venta && (
              <tr className="bg-gray-50">
                <td colSpan="8" className="p-4">
                  <p className="font-semibold mb-2">Productos de la venta #{v.id_venta}:</p>
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
                        <tr key={d.id_detalle_venta} className="border-t">
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
    </div>
  )
}

export default Ventas
