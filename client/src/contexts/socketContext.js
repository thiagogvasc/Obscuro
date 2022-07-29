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
        // actually no
        // yes actually
        // pass user as an argument
        const persistedUser = JSON.parse(sessionStorage.getItem('user'))
        const newSocket = io('http://obscuro.herokuapp.com', {
            withCredentials: true
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

    const emitJoinChat = () => {
        socketRef.current.emit('join-chat')
    }

    const emitCreateConversation = (conversation, ack) => {
        socketRef.current.emit('create-conversation', conversation, ack)
    }

    const onChatJoined = (callback) => {
        socketRef.current.on('chat-joined', callback)
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
        socketRef,
        connected,
        connectError,
        initConnection,
        emitMessage,
        emitLogin,
        emitFetchMessages,
        emitJoinChat,
        emitCreateConversation,
        onChatJoined,
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