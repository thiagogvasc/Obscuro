import React, { useContext } from 'react'
import { createContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '../contexts/socketContext'


const userContext = createContext({})

export function UserProvider({ children }) {
    const [user, setUser] = useState({ username: 'Anonymous', color: '#000000', isLoggedIn: false  })
    const navigate = useNavigate()
    const socket = useSocket()

    const logout = () => {
        console.log('logout called')
        socket.emitLogout()
        sessionStorage.clear()
        setUser(null)
        navigate('/')
    }

    const value = {
        user,
        setUser,
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
