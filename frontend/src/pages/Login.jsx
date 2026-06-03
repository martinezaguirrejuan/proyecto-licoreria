import { useState } from 'react'                                              
                                                                              
  function Login({ onLogin }) {                                                 
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')                                
    const [error, setError] = useState('')                                    

    const handleSubmit = (e) => {
      e.preventDefault()
      const base = import.meta.env.VITE_API_URL                                 
  
      fetch(`${base}/auth/login`, {                                             
        method: 'POST',                                                       
        headers: { 'Content-Type': 'application/json' },                        
        body: JSON.stringify({ email, password })
      })                                                                        
        .then(res => res.json())                                              
        .then(data => {                                                         
          if (data.error) {
            setError('Credenciales incorrectas')                                
          } else {                                                            
            onLogin(data)
          }
        })
    }                                                                           
   
    return (                                                                    
      <div className="min-h-screen flex items-center justify-center           
  bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow w-96">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Licorería</h1>  
                                                                                
          <form onSubmit={handleSubmit}>                                        
            <input                                                              
              type="email"                                                    
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border p-2 rounded mb-3"                        
            />
            <input                                                              
              type="password"                                                 
              placeholder="Contraseña"                                          
              value={password}
              onChange={e => setPassword(e.target.value)}                       
              className="w-full border p-2 rounded mb-3"                      
            />
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <button type="submit" className="w-full bg-gray-800 text-white py-2 
  rounded hover:bg-gray-900">                                                   
              Ingresar                                                          
            </button>                                                           
          </form>                                                             
        </div>
      </div>
    )
  }

  export default Login
