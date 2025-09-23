import React from 'react';
import { useAuth } from './context/AuthContext';

const TestComponent = () => {
  const { user } = useAuth();
  
  console.log('TestComponent user:', user);
  
  return (
    <div>
      <h2>Test Component</h2>
      <p>Usuario: {user ? user.email : 'No autenticado'}</p>
    </div>
  );
};

export default TestComponent;