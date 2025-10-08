import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { authService } from '../api/authService';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Para probar sin backend, usa estos datos de ejemplo
      if (email === 'admin@test.com' && password === 'password') {
        // Simular respuesta del servidor
        const mockResponse = {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-token',
          user: {
            id: 1,
            name: 'Admin User',
            email: 'admin@test.com'
          }
        };
        
        login(mockResponse.token, mockResponse.user);
      } else {
        // Intento de login real con el servicio
        const response = await authService.login(email, password);
        login(response.token, response.user);
      }
    } catch (error) {
      setError(error.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title text-center">Iniciar Sesión</h3>
        
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@test.com"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="password"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-3">
          <small className="text-muted">
            <strong>Credenciales de prueba:</strong><br />
            Email: admin@test.com<br />
            Password: password
          </small>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;