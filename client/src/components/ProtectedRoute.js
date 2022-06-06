import React from 'react'
import { useUser } from '../contexts/userContext'
import { useSocket } from '../contexts/socketContext'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
    const user = useUser()
    const socket = useSocket()
    const persistedUser = JSON.parse(sessionStorage.getItem('user'))

    if (!persistedUser) {
        console.log('not logged in')
        return <Navigate to="/" />
    } else {
        if (socket.connected) {
            return (<>{children}</>)
        }
        socket.initConnection()
        socket.onAuthorized(() => {
            user.setUser(persistedUser)
            return (<>{ children }</>)
        })
    }

    return ( <>connecting to chat</> )
}

export default ProtectedRoute