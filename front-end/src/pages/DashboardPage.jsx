import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-soft border-0">
            <div className="card-header bg-white py-4">
              <h1 className="h2 mb-0 text-primary">📊 Dashboard</h1>
              <p className="text-muted mb-0">Panel principal de la aplicación</p>
            </div>
            <div className="card-body p-5">
              <div className="alert alert-success border-0 shadow-sm">
                <h5 className="alert-heading">¡Bienvenido!</h5>
                Has iniciado sesión correctamente como <strong>{user?.name || user?.email}</strong>
              </div>

             
<div className="row mt-4">
    <div className="col-md-4 mb-3">
        <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center">
                <div className="display-6 text-primary mb-3">👥</div>
                <h5 className="card-title">Gestión de Usuarios</h5>
                <p className="card-text text-muted mb-3">Administra usuarios del sistema</p>
                <Link to="/users" className="btn btn-primary">Ir a Usuarios</Link>
            </div>
        </div>
    </div>
    
    <div className="col-md-4 mb-3">
        <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center">
                <div className="display-6 text-warning mb-3">🛡️</div>
                <h5 className="card-title">Mitigación</h5>
                <p className="card-text text-muted mb-3">Gestiona reglas de seguridad</p>
                <Link to="/mitigation" className="btn btn-warning">Ir a Mitigación</Link>
            </div>
        </div>
    </div>
    
    <div className="col-md-4 mb-3">
        <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center">
                <div className="display-6 text-danger mb-3">⚔️</div>
                <h5 className="card-title">Monitor de Ataques</h5>
                <p className="card-text text-muted mb-3">Visualiza ataques de seguridad</p>
                <Link to="/attacks" className="btn btn-danger">Ir a Ataques</Link>
            </div>
        </div>
    </div>
    
    <div className="col-md-6 mb-3">
        <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center">
                <div className="display-6 text-info mb-3">🌐</div>
                <h5 className="card-title">Tráfico en Tiempo Real</h5>
                <p className="card-text text-muted mb-3">Monitor de red en vivo</p>
                <Link to="/traffic" className="btn btn-info">Ir a Tráfico</Link>
            </div>
        </div>
    </div>
    
    <div className="col-md-6 mb-3">
        <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center">
                <div className="display-6 text-success mb-3">🏠</div>
                <h5 className="card-title">Página Principal</h5>
                <p className="card-text text-muted mb-3">Regresa al inicio</p>
                <Link to="/" className="btn btn-success">Ir al Inicio</Link>
            </div>
        </div>
    </div>
</div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;