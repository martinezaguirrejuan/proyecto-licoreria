import { useEffect, useState } from 'react'

function Proveedores() {
  const [proveedores, setProveedores] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [proveedorEditando, setProveedorEditando] = useState(null)
  const [form, setForm] = useState({ nit: '', nombre_empresa: '', telefono: '', email: '', persona_contacto: '' })

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/proveedores`)
      .then(res => res.json())
      .then(data => setProveedores(data))
  }, [])

  const guardarProveedor = () => {
    const url = proveedorEditando
      ? `${import.meta.env.VITE_API_URL}/proveedores/${proveedorEditando}`
      : `${import.meta.env.VITE_API_URL}/proveedores`
    const method = proveedorEditando ? 'PUT' : 'POST'

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(() => {
        setMostrarFormulario(false)
        setProveedorEditando(null)
        fetch(`${import.meta.env.VITE_API_URL}/proveedores`)
          .then(res => res.json())
          .then(data => setProveedores(data))
      })
  }

  const editarProveedor = (p) => {
    setProveedorEditando(p.nit)
    setMostrarFormulario(true)
    setForm({ nit: p.nit, nombre_empresa: p.nombre_empresa, telefono: p.telefono, email: p.email, persona_contacto: p.persona_contacto })
  }

  const eliminarProveedor = (nit) => {
    fetch(`${import.meta.env.VITE_API_URL}/proveedores/${nit}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => {
        fetch(`${import.meta.env.VITE_API_URL}/proveedores`)
          .then(res => res.json())
          .then(data => setProveedores(data))
      })
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Proveedores</h1>

      <button
        onClick={() => { setMostrarFormulario(true); setProveedorEditando(null) }}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        + Agregar proveedor
      </button>

      {mostrarFormulario && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4">{proveedorEditando ? 'Editar proveedor' : 'Nuevo proveedor'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input placeholder="NIT" value={form.nit} disabled={!!proveedorEditando} className="border p-2 rounded" onChange={e => setForm({...form, nit: e.target.value})} />
            <input placeholder="Nombre empresa" value={form.nombre_empresa} className="border p-2 rounded" onChange={e => setForm({...form, nombre_empresa: e.target.value})} />
            <input placeholder="Teléfono" value={form.telefono} className="border p-2 rounded" onChange={e => setForm({...form, telefono: e.target.value})} />
            <input placeholder="Email" value={form.email} className="border p-2 rounded" onChange={e => setForm({...form, email: e.target.value})} />
            <input placeholder="Persona de contacto" value={form.persona_contacto} className="border p-2 rounded" onChange={e => setForm({...form, persona_contacto: e.target.value})} />
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={guardarProveedor} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Guardar</button>
            <button onClick={() => { setMostrarFormulario(false); setProveedorEditando(null) }} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">Cancelar</button>
          </div>
        </div>
      )}

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {proveedores.map(p => (
          <div key={p.nit} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{p.nombre_empresa}</p>
                <p className="text-sm text-gray-500">NIT: {p.nit}</p>
                <p className="text-sm text-gray-500">{p.telefono} · {p.email}</p>
                {p.persona_contacto && <p className="text-sm text-gray-500">Contacto: {p.persona_contacto}</p>}
              </div>
              <div className="flex flex-col gap-1 ml-2">
                <button onClick={() => editarProveedor(p)} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">Editar</button>
                <button onClick={() => eliminarProveedor(p.nit)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
      <table className="w-full bg-white rounded-lg shadow">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="p-3 text-left">NIT</th>
            <th className="p-3 text-left">Empresa</th>
            <th className="p-3 text-left">Teléfono</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Contacto</th>
            <th className="p-3 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map(p => (
            <tr key={p.nit} className="border-b hover:bg-gray-50">
              <td className="p-3">{p.nit}</td>
              <td className="p-3">{p.nombre_empresa}</td>
              <td className="p-3">{p.telefono}</td>
              <td className="p-3">{p.email}</td>
              <td className="p-3">{p.persona_contacto}</td>
              <td className="p-3 flex gap-2">
                <button onClick={() => editarProveedor(p)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Editar</button>
                <button onClick={() => eliminarProveedor(p.nit)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}

export default Proveedores
