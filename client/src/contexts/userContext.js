import React, { useContext, useEffect } from 'react'
import { createContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '../contexts/socketContext'


const userContext = createContext({})

export function UserProvider({ children }) {
    const [user, setUser] = useState({ username: 'Anonymous', color: '#FFFFFF', isLoggedIn: false } )

    const socket = useSocket()
    const navigate = useNavigate()

    const login = (username, color) => {
        socket.initiateConnection({ username, color }, () => {
            setUser({
                ...user,
                username,
                color,
                isLoggedIn: true
            })
            navigate('/chat')
        })
    }

    const logout = () => {
        setUser({ ...user, isLoggedIn: false })
        navigate('/')
    }

    const value = {
        user,
        setUser,
        login,
        logout
    }

    return (
        <userContext.Provider value={ value }>
            { children }
        </userContext.Provider>
    )
}

export const useUser = () => {
    return useContext(userContext)
}
