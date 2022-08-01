import React, { useContext, useEffect } from 'react'
import { createContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '../contexts/socketContext'
import Login from '../pages/Login'


const userContext = createContext({})

export function UserProvider({ children }) {
    const [userID, setUserID] = useState(undefined)
    const [user, setUser] = useState(null)
    console.log(userID)
    const value = {
        userID,
        user,
        setUser,
        setUserID
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
