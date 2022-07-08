import React, { useEffect } from 'react'
import { useUser } from '../contexts/userContext'
import { useSocket } from '../contexts/socketContext'
import { useNavigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
    // const user = useUser()
    // const socket = useSocket()
    // const persistedUser = JSON.parse(sessionStorage.getItem('user'))

    // if (!persistedUser) {
    //     console.log('not logged in')
    //     return <Navigate to="/" />
    // } else {
    //     if (socket.connected) {
    //         return (<>{children}</>)
    //     }
    //     socket.initConnection()
    //     socket.onAuthorized(() => {
    //         user.setUser(persistedUser)
    //         return (<>{ children }</>)
    //     })
    // }

    // return ( <>connecting to chat</> )

    // >>remove<<
    const socket = useSocket()
    const navigate = useNavigate()
    useEffect(() => {
        if (socket.connectError) {
            console.log(socket.connectError)
            if (socket.connectError.message === 'unauthorized') {
                navigate('/')
            }
        }
    }, [socket])
    return (<>{children}</>)
}

export default ProtectedRoute