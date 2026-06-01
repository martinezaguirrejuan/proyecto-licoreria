import { useEffect, useState } from 'react'

function Clientes() {
  const [clientes, setClientes] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [clienteEditando, setClienteEditando] = useState(null)
  const [form, setForm] = useState({ cedula: '', nombre: '', telefono: '', email: '', direccion: '' })

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/clientes`)
      .then(res => res.json())
      .then(data => setClientes(data))
  }, [])

  const guardarCliente = () => {
    const url = clienteEditando
      ? `${import.meta.env.VITE_API_URL}/clientes/${clienteEditando}`
      : `${import.meta.env.VITE_API_URL}/clientes`
    const method = clienteEditando ? 'PUT' : 'POST'

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(() => {
        setMostrarFormulario(false)
        setClienteEditando(null)
        fetch(`${import.meta.env.VITE_API_URL}/clientes`)
          .then(res => res.json())
          .then(data => setClientes(data))
      })
  }

  const editarCliente = (c) => {
    setClienteEditando(c.cedula)
    setMostrarFormulario(true)
    setForm({ cedula: c.cedula, nombre: c.nombre, telefono: c.telefono, email: c.email, direccion: c.direccion })
  }

  const eliminarCliente = (cedula) => {
    fetch(`${import.meta.env.VITE_API_URL}/clientes/${cedula}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => {
        fetch(`${import.meta.env.VITE_API_URL}/clientes`)
          .then(res => res.json())
          .then(data => setClientes(data))
      })
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Clientes</h1>

      <button
        onClick={() => { setMostrarFormulario(true); setClienteEditando(null) }}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        + Agregar cliente
      </button>

      {mostrarFormulario && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4">{clienteEditando ? 'Editar cliente' : 'Nuevo cliente'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input placeholder="Cédula" value={form.cedula} disabled={!!clienteEditando} className="border p-2 rounded" onChange={e => setForm({...form, cedula: e.target.value})} />
            <input placeholder="Nombre" value={form.nombre} className="border p-2 rounded" onChange={e => setForm({...form, nombre: e.target.value})} />
            <input placeholder="Teléfono" value={form.telefono} className="border p-2 rounded" onChange={e => setForm({...form, telefono: e.target.value})} />
            <input placeholder="Email" value={form.email} className="border p-2 rounded" onChange={e => setForm({...form, email: e.target.value})} />
            <input placeholder="Dirección" value={form.direccion} className="border p-2 rounded" onChange={e => setForm({...form, direccion: e.target.value})} />
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={guardarCliente} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Guardar</button>
            <button onClick={() => { setMostrarFormulario(false); setClienteEditando(null) }} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">Cancelar</button>
          </div>
        </div>
      )}

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {clientes.map(c => (
          <div key={c.cedula} className="bg-white rounded-lg shadow p-4">
            <p className="font-semibold">{c.nombre}</p>
            <p className="text-sm text-gray-500">CC: {c.cedula}</p>
            <p className="text-sm text-gray-500">{c.telefono} · {c.email}</p>
            {c.direccion && <p className="text-sm text-gray-500">{c.direccion}</p>}
            <div className="flex gap-2 mt-3">
              <button onClick={() => editarCliente(c)} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">Editar</button>
              <button onClick={() => eliminarCliente(c.cedula)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
      <table className="w-full bg-white rounded-lg shadow">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="p-3 text-left">Cédula</th>
            <th className="p-3 text-left">Nombre</th>
            <th className="p-3 text-left">Teléfono</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Dirección</th>
            <th className="p-3 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map(c => (
            <tr key={c.cedula} className="border-b hover:bg-gray-50">
              <td className="p-3">{c.cedula}</td>
              <td className="p-3">{c.nombre}</td>
              <td className="p-3">{c.telefono}</td>
              <td className="p-3">{c.email}</td>
              <td className="p-3">{c.direccion}</td>
              <td className="p-3 flex gap-2">
                <button onClick={() => editarCliente(c)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Editar</button>
                <button onClick={() => eliminarCliente(c.cedula)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}

export default Clientes
