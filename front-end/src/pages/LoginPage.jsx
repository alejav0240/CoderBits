import React from 'react';
import { Navigate } from 'react-router-dom';
import LoginForm from '../features/auth/ui/LoginForm';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { user } = useAuth();

  // Si el usuario ya está autenticado, redirigir al dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;