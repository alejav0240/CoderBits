import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
            <div className="container">
                {/* Brand/Logo */}
                <Link className="navbar-brand fw-bold" to="/">
                    🚀 CoderBits
                </Link>

                {/* Toggle button para móviles */}
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Items de navegación */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link 
                                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} 
                                to="/"
                            >
                                🏠 Inicio
                            </Link>
                        </li>
                        
                        {/* Mostrar estas opciones solo si el usuario está autenticado */}
                       
{user && (
    <>
        <li className="nav-item">
            <Link className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`} to="/dashboard">
                📊 Dashboard
            </Link>
        </li>
        <li className="nav-item">
            <Link className={`nav-link ${location.pathname === '/users' ? 'active' : ''}`} to="/users">
                👥 Usuarios
            </Link>
        </li>
        <li className="nav-item">
            <Link className={`nav-link ${location.pathname === '/mitigation' ? 'active' : ''}`} to="/mitigation">
                🛡️ Mitigación
            </Link>
        </li>
        <li className="nav-item">
            <Link className={`nav-link ${location.pathname === '/attacks' ? 'active' : ''}`} to="/attacks">
                ⚔️ Ataques
            </Link>
        </li>
        <li className="nav-item">
            <Link className={`nav-link ${location.pathname === '/traffic' ? 'active' : ''}`} to="/traffic">
                🌐 Tráfico
            </Link>
        </li>
    </>
)}

                    </ul>

                    {/* Lado derecho - Información del usuario */}
                    <div className="navbar-nav">
                        {user ? (
                            <div className="d-flex align-items-center gap-3">
                                <span className="navbar-text text-light">
                                    👋 Hola, <strong>{user.name || user.email}</strong>
                                </span>
                                <button 
                                    onClick={handleLogout} 
                                    className="btn btn-outline-light btn-sm"
                                >
                                    🚪 Cerrar Sesión
                                </button>
                            </div>
                        ) : (
                            <Link 
                                className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`} 
                                to="/login"
                            >
                                🔐 Iniciar Sesión
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;