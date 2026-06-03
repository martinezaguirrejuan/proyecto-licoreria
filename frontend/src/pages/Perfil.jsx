import { useState } from 'react'

function Perfil({ usuario, onActualizarUsuario }) {
  const [passwordActual, setPasswordActual] = useState('')
  const [passwordNueva, setPasswordNueva] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  const cambiarPassword = () => {
    if (!passwordActual || !passwordNueva) {
      setError('Completa ambos campos')
      return
    }

    const base = import.meta.env.VITE_API_URL

    fetch(`${base}/auth/cambiar-password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_usuario: usuario.id_usuario,
        password_actual: passwordActual,
        password_nueva: passwordNueva
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
          setMensaje('')
        } else {
          setMensaje('Contraseña actualizada correctamente')
          setError('')
          setPasswordActual('')
          setPasswordNueva('')
        }
      })
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Mi perfil</h1>

      <div className="bg-white rounded-lg shadow p-6 max-w-md">
        <p className="text-gray-600 mb-1">Nombre</p>
        <p className="text-xl font-semibold mb-4">{usuario.nombre}</p>

        <p className="text-gray-600 mb-1">Email</p>
        <p className="text-xl font-semibold mb-4">{usuario.email}</p>

        <p className="text-gray-600 mb-1">Rol</p>
        <p className="text-xl font-semibold mb-6 capitalize">{usuario.rol}</p>

        <h2 className="text-lg font-bold mb-4">Cambiar contraseña</h2>

        <input
          type="password"
          placeholder="Contraseña actual"
          value={passwordActual}
          onChange={e => setPasswordActual(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={passwordNueva}
          onChange={e => setPasswordNueva(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />
        {error && <p className="text-sm mb-3 text-red-500">{error}</p>}
        {mensaje && <p className="text-sm mb-3 text-green-600">{mensaje}</p>}
        <button onClick={cambiarPassword} className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-900">
          Guardar
        </button>
      </div>
    </div>
  )
}

export default Perfil
