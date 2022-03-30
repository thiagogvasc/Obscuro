import React, { useContext } from 'react'
import { createContext, useState } from 'react'

import { io } from 'socket.io-client'


const socketContext = createContext({})

export function SocketProvider({ children }) {

    const [socket, setSocket] = useState(null)

    const initiateConnection = (initialState, callback) => {
        const newSocket = io('http://localhost:8080', initialState)
        newSocket.on('connect', () => {
            callback()
        })
        setSocket(newSocket)
    }
    
    const emitMessage = (message) => {
        socket.emit('message', message)
    }
    
    const onMessage = (callback) => {
        socket.on('message', callback)
    }
    
    const value = { 
        socket, 
        setSocket,
        initiateConnection,
        emitMessage,
        onMessage
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