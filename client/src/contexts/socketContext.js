import React, { useContext, useEffect } from 'react'
import { createContext, useState, useRef } from 'react'

import { io } from 'socket.io-client'

const socketContext = createContext({})

export function SocketProvider({ children }) {
    // const [socket, setSocket] = useState(null)
    const socketRef = useRef(null)
    const [connected, setConnected] = useState(false)
    const [connectError, setConnectError] = useState(null)

    const initConnection = () => {
        // put this in user.login
        const persistedUser = JSON.parse(sessionStorage.getItem('user'))
        const newSocket = io('http://localhost:8080', {
            auth: {
                sessionID: persistedUser?.sessionID
            }
        })

        newSocket.on('connect', () => {
            setConnected(true)
        })

        newSocket.on('connect_error', err => {
            setConnectError(err)
            console.log(err.message)
        })

        socketRef.current = newSocket
    }
    
    const emitMessage = (message) => {
        socketRef.current.emit('message', message)
    }

    const emitLogin = (initialState) => {
        socketRef.current.emit('login', initialState)
    }

    const emitFetchMessages = (room) => {
        socketRef.current.emit('fetch-messages', room)
    }

    const joinRoom = (room) => {
        socketRef.current.emit('join-room', room)
    }

    const emitLogout = () => {
        socketRef.current.emit('logout')
    }
    
    const onMessage = (callback) => {
        socketRef.current.on('message', callback)
    }

    const onMessages = (callback) => {
        socketRef.current.on('messages', callback)
    }

    const onLoginSuccess = (callback) => {
        socketRef.current.on('login-success', callback)
    }

    const onAuthorized = (callback) => {
        socketRef.current.on('authorized', callback)
    }

    const onUsers = (callback) => {
        socketRef.current.on('users', callback);
    }
    
    const value = { 
        connected,
        connectError,
        initConnection,
        emitMessage,
        emitLogin,
        emitFetchMessages,
        joinRoom,
        emitLogout,
        onMessage,
        onMessages,
        onLoginSuccess,
        onAuthorized,
        onUsers,
    }
    return (
        <socketContext.Provider value={ value }>
            { children }
        </socketContext.Provider>
    )
}

export const useSocket = () => {
    return useContext(socketContext)
}