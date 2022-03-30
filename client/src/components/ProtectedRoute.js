import React from 'react'
import { useUser } from '../contexts/userContext'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
    const { user } = useUser()

    if (!user.isLoggedIn) {
        return <Navigate to="/" />
    }

    return ( <>{ children }</> )
}

export default ProtectedRoute