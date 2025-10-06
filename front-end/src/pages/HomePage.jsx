import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <>
      {/* Hero Section - Pantalla completa */}
      <section className="hero-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 text-center">
              <div className="hero-content fade-in">
                <h1 className="display-4 fw-bold mb-4">
                  Bienvenido a <span className="text-warning">CoderBits</span>
                </h1>
                <p className="lead mb-5 fs-5 opacity-90">
                  Sistema de gestión moderno con autenticación JWT, 
                  gestión de usuarios y arquitectura escalable
                </p>

                {user ? (
                  <div className="fade-in">
                    <div className="alert alert-success d-inline-block mb-4">
                      ✅ Ya estás autenticado como <strong>{user.email}</strong>
                    </div>
                    <div className="d-flex gap-3 justify-content-center flex-wrap">
                      <Link to="/dashboard" className="btn btn-light btn-lg shadow">
                        📊 Ir al Dashboard
                      </Link>
                      <Link to="/users" className="btn btn-outline-light btn-lg">
                        👥 Gestionar Usuarios
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="fade-in">
                    <p className="text-light mb-4 fs-6">
                      Inicia sesión para acceder a todas las funcionalidades del sistema
                    </p>
                    <Link to="/login" className="btn btn-warning btn-lg shadow">
                      🔐 Iniciar Sesión
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <h2 className="text-center mb-5">Características Principales</h2>
              
              <div className="row">
                <div className="col-md-4 mb-4">
                  <div className="card h-100 shadow-soft border-0">
                    <div className="card-body text-center p-4">
                      <div className="display-6 text-primary mb-3">🔐</div>
                      <h5 className="card-title">Autenticación Segura</h5>
                      <p className="card-text text-muted">
                        Sistema de login con JWT tokens, rutas protegidas y manejo de sesiones.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-4 mb-4">
                  <div className="card h-100 shadow-soft border-0">
                    <div className="card-body text-center p-4">
                      <div className="display-6 text-success mb-3">👥</div>
                      <h5 className="card-title">Gestión de Usuarios</h5>
                      <p className="card-text text-muted">
                        CRUD completo con paginación, búsqueda y almacenamiento en cache.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-4 mb-4">
                  <div className="card h-100 shadow-soft border-0">
                    <div className="card-body text-center p-4">
                      <div className="display-6 text-info mb-3">⚡</div>
                      <h5 className="card-title">Alto Rendimiento</h5>
                      <p className="card-text text-muted">
                        Arquitectura moderna con React, Vite y optimizaciones de rendimiento.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;