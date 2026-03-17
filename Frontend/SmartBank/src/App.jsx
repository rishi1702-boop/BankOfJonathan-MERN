import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Homepage'
import Register from "./pages/register"
import Login from "./pages/login"
import Dashboard from "./pages/Dashboard"
import PrivateRoute from './pages/PrivateRoute';
import Transactionpage from './pages/Transaction';
import Goals from './pages/Goals';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import useAuthStore from './store/useAuthStore';

const App = () => {
  const checkAuth = useAuthStore(state => state.checkAuth);
  const isCheckingAuth = useAuthStore(state => state.isCheckingAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return <div className="flex h-screen items-center justify-center text-xl font-semibold">Initializing SmartBank...</div>
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/transaction"
          element={
            <PrivateRoute>
              <Transactionpage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/goals"
          element={
            <PrivateRoute>
              <Goals />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/admin"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  )
}

export default App