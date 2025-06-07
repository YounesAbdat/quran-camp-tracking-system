import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import AdminDashboard from './pages/AdminDashboard';
import SupervisorDashboard from './pages/SupervisorDashboard';

function App() {
  const [role, setRole] = useState(localStorage.getItem('role'));

  const handleLogin = (userRole) => {
    setRole(userRole);
    localStorage.setItem('role', userRole);
  };

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={
          !role ? <LoginForm onLogin={handleLogin} /> :
          role === 'admin' ? <Navigate to="/admin" /> :
          <Navigate to="/supervisor" />
        } />
        <Route path="/admin" element={role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
        <Route path="/supervisor" element={role === 'supervisor' ? <SupervisorDashboard /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
