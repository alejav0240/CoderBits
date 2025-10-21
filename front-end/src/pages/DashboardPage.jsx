import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
//import dashboardService from "../services/dashboardService";

const DashboardPage = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState({
    totalAttacks: 0,
    activeThreats: 0,
    mitigationRules: 0,
    activeConnections: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //useEffect(() => {
  //  const fetchDashboardData = async () => {
  //    try {
  //      setLoading(true);
  //      const summaryData = await dashboardService.getSummaryData();
  //      setSummary(summaryData);
  //    } catch (err) {
  //      console.error("Error al cargar datos del dashboard:", err);
  //      setError("No se pudieron cargar los datos del dashboard");
  //    } finally {
  //      setLoading(false);
  //    }
  //  };

  //  fetchDashboardData();
  //}, []);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-soft border-0">
            <div className="card-header bg-white py-4">
              <h1 className="h2 mb-0 text-primary">📊 Dashboard</h1>
              <p className="text-muted mb-0">
                Panel principal de la aplicación
              </p>
            </div>
            <div className="card-body p-5">
              <div className="alert alert-success border-0 shadow-sm">
                <h5 className="alert-heading">¡Bienvenido!</h5>
                Has iniciado sesión correctamente como{" "}
                <strong>{user?.name || user?.email}</strong>
              </div>

              {loading ? (
                <div className="text-center my-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                  <p className="mt-2">Cargando datos del dashboard...</p>
                </div>
              ) : error ? (
                <div className="alert alert-danger">{error}</div>
              ) : (
                <div className="row mb-4">
                  <div className="col-md-3 mb-3">
                    <div className="card border-0 shadow-sm">
                      <div className="card-body text-center">
                        <h3 className="text-danger">{summary.totalAttacks}</h3>
                        <p className="text-muted mb-0">Ataques Totales</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="card border-0 shadow-sm">
                      <div className="card-body text-center">
                        <h3 className="text-warning">
                          {summary?.activeThreats}
                        </h3>
                        <p className="text-muted mb-0">Amenazas Activas</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="card border-0 shadow-sm">
                      <div className="card-body text-center">
                        <h3 className="text-success">
                          {summary?.mitigationRules}
                        </h3>
                        <p className="text-muted mb-0">Reglas de Mitigación</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="card border-0 shadow-sm">
                      <div className="card-body text-center">
                        <h3 className="text-info">
                          {summary?.activeConnections}
                        </h3>
                        <p className="text-muted mb-0">Conexiones Activas</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="row mt-4">
                <div className="col-md-4 mb-3">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body text-center">
                      <div className="display-6 text-primary mb-3">👥</div>
                      <h5 className="card-title">Gestión de Usuarios</h5>
                      <p className="card-text text-muted mb-3">
                        Administra usuarios del sistema
                      </p>
                      <Link to="/users" className="btn btn-primary">
                        Ir a Usuarios
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="col-md-4 mb-3">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body text-center">
                      <div className="display-6 text-warning mb-3">🛡️</div>
                      <h5 className="card-title">Mitigación</h5>
                      <p className="card-text text-muted mb-3">
                        Gestiona reglas de seguridad
                      </p>
                      <Link to="/mitigation" className="btn btn-warning">
                        Ir a Mitigación
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="col-md-4 mb-3">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body text-center">
                      <div className="display-6 text-danger mb-3">⚔️</div>
                      <h5 className="card-title">Monitor de Ataques</h5>
                      <p className="card-text text-muted mb-3">
                        Visualiza ataques de seguridad
                      </p>
                      <Link to="/attacks" className="btn btn-danger">
                        Ir a Ataques
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body text-center">
                      <div className="display-6 text-info mb-3">🌐</div>
                      <h5 className="card-title">Tráfico en Tiempo Real</h5>
                      <p className="card-text text-muted mb-3">
                        Monitor de red en vivo
                      </p>
                      <Link to="/traffic" className="btn btn-info">
                        Ir a Tráfico
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body text-center">
                      <div className="display-6 text-success mb-3">🏠</div>
                      <h5 className="card-title">Página Principal</h5>
                      <p className="card-text text-muted mb-3">
                        Regresa al inicio
                      </p>
                      <Link to="/" className="btn btn-success">
                        Ir al Inicio
                      </Link>
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
