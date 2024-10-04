import React, { Children, useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { UserContext } from '../context/UserContext'

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(UserContext)

  if (!token) {
    return <Navigate to='/' replace/>
  }

  return children
}

export default ProtectedRoute
