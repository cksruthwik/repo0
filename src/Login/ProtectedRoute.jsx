// src/components/auth/ProtectedRoute.jsx
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth()
    console.log('🛡 ProtectedRoute - loading:', loading, 'isAuthenticated:', isAuthenticated);
  
    if (loading) return <div>Loading authentication...</div>
  
    return isAuthenticated ? children : <Navigate to="/" replace />
  }

export default ProtectedRoute
