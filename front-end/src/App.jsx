import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './shared/ui/PrivateRoute';
import Navbar from './shared/ui/Navbar';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import UsersPage from './pages/UsersPage';
import MitigationPage from './pages/MitigationPage';
import AttacksPage from './pages/AttacksPage';
import TrafficPage from './pages/TrafficPage';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <DashboardPage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/users" 
                element={
                  <PrivateRoute>
                    <UsersPage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/mitigation" 
                element={
                  <PrivateRoute>
                    <MitigationPage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/attacks" 
                element={
                  <PrivateRoute>
                    <AttacksPage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/traffic" 
                element={
                  <PrivateRoute>
                    <TrafficPage />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

// ✅ Asegurar que tenga export default
export default App;