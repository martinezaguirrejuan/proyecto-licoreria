import { useEffect, useState } from 'react'

const diasSemana = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo']

function Empleados() {
  const [empleados, setEmpleados] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [empleadoEditando, setEmpleadoEditando] = useState(null)
  const [form, setForm] = useState({
    cedula: '', nombre: '', cargo: '', dias_labora: [],
    telefono: '', email: '', fecha_contratacion: '', salario: ''
  })

  const cargarEmpleados = () => {
    fetch(`${import.meta.env.VITE_API_URL}/empleados`)
      .then(res => res.json())
      .then(data => setEmpleados(data))
  }

  useEffect(() => {
    cargarEmpleados()
  }, [])

  const toggleDia = (dia) => {
    setForm(prev => {
      const yaEsta = prev.dias_labora.includes(dia)
      return {
        ...prev,
        dias_labora: yaEsta
          ? prev.dias_labora.filter(d => d !== dia)
          : [...prev.dias_labora, dia]
      }
    })
  }

  const guardarEmpleado = () => {
    const url = empleadoEditando
      ? `${import.meta.env.VITE_API_URL}/empleados/${empleadoEditando}`
      : `${import.meta.env.VITE_API_URL}/empleados`
    const method = empleadoEditando ? 'PUT' : 'POST'

    const body = {
      ...form,
      dias_labora: form.dias_labora.join(',')
    }

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(() => {
        setMostrarFormulario(false)
        setEmpleadoEditando(null)
        setForm({ cedula: '', nombre: '', cargo: '', dias_labora: [], telefono: '', email: '', fecha_contratacion: '', salario: '' })
        cargarEmpleados()
      })
  }

  const editarEmpleado = (e) => {
    setEmpleadoEditando(e.cedula)
    setMostrarFormulario(true)
    setForm({
      cedula: e.cedula,
      nombre: e.nombre,
      cargo: e.cargo,
      dias_labora: e.dias_labora ? e.dias_labora.split(',') : [],
      telefono: e.telefono,
      email: e.email,
      fecha_contratacion: e.fecha_contratacion ? e.fecha_contratacion.substring(0, 10) : '',
      salario: e.salario
    })
  }

  const eliminarEmpleado = (cedula) => {
    fetch(`${import.meta.env.VITE_API_URL}/empleados/${cedula}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => cargarEmpleados())
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Empleados</h1>

      <button
        onClick={() => { setMostrarFormulario(true); setEmpleadoEditando(null); setForm({ cedula: '', nombre: '', cargo: '', dias_labora: [], telefono: '', email: '', fecha_contratacion: '', salario: '' }) }}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        + Agregar empleado
      </button>

      {mostrarFormulario && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4">{empleadoEditando ? 'Editar empleado' : 'Nuevo empleado'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input placeholder="Cédula" value={form.cedula} disabled={!!empleadoEditando} className="border p-2 rounded" onChange={e => setForm({...form, cedula: e.target.value})} />
            <input placeholder="Nombre" value={form.nombre} className="border p-2 rounded" onChange={e => setForm({...form, nombre: e.target.value})} />
            <select value={form.cargo} className="border p-2 rounded" onChange={e => setForm({...form, cargo: e.target.value})}>
              <option value="">-- Cargo --</option>
              <option value="Cajero">Cajero</option>
              <option value="Vendedor">Vendedor</option>
              <option value="Almacenista">Almacenista</option>
              <option value="Administrador">Administrador</option>
            </select>
            <input placeholder="Teléfono" value={form.telefono} className="border p-2 rounded" onChange={e => setForm({...form, telefono: e.target.value})} />
            <input placeholder="Email" value={form.email} className="border p-2 rounded" onChange={e => setForm({...form, email: e.target.value})} />
            <input type="date" value={form.fecha_contratacion} className="border p-2 rounded" onChange={e => setForm({...form, fecha_contratacion: e.target.value})} />
            <input placeholder="Salario" value={form.salario} className="border p-2 rounded" onChange={e => setForm({...form, salario: e.target.value})} />
          </div>

          <div className="mt-4">
            <p className="font-semibold mb-2">Días que labora:</p>
            <div className="flex gap-3 flex-wrap">
              {diasSemana.map(dia => (
                <label key={dia} className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.dias_labora.includes(dia)}
                    onChange={() => toggleDia(dia)}
                  />
                  {dia}
                </label>
              ))}
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button onClick={guardarEmpleado} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Guardar</button>
            <button onClick={() => { setMostrarFormulario(false); setEmpleadoEditando(null) }} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">Cancelar</button>
          </div>
        </div>
      )}

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {empleados.map(e => (
          <div key={e.cedula} className="bg-white rounded-lg shadow p-4">
            <p className="font-semibold">{e.nombre}</p>
            <p className="text-sm text-gray-500">{e.cargo} · CC: {e.cedula}</p>
            <p className="text-sm text-gray-500">{e.telefono}</p>
            <p className="text-sm text-gray-500">Salario: ${Number(e.salario).toLocaleString()}</p>
            {e.dias_labora && <p className="text-sm text-gray-500">{e.dias_labora}</p>}
            <div className="flex gap-2 mt-3">
              <button onClick={() => editarEmpleado(e)} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">Editar</button>
              <button onClick={() => eliminarEmpleado(e.cedula)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Eliminar</button>
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
            <th className="p-3 text-left">Cargo</th>
            <th className="p-3 text-left">Días labora</th>
            <th className="p-3 text-left">Teléfono</th>
            <th className="p-3 text-left">Salario</th>
            <th className="p-3 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleados.map(e => (
            <tr key={e.cedula} className="border-b hover:bg-gray-50">
              <td className="p-3">{e.cedula}</td>
              <td className="p-3">{e.nombre}</td>
              <td className="p-3">{e.cargo}</td>
              <td className="p-3">{e.dias_labora}</td>
              <td className="p-3">{e.telefono}</td>
              <td className="p-3">${Number(e.salario).toLocaleString()}</td>
              <td className="p-3 flex gap-2">
                <button onClick={() => editarEmpleado(e)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Editar</button>
                <button onClick={() => eliminarEmpleado(e.cedula)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}

export default Empleados
