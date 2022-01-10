import React from 'react'
import { createContext, useState } from 'react'


const userContext = createContext({ username: 'Unknown' })

function UserProvider({ children }) {
    const [userInfo, setUserInfo] = useState({ username: 'Anonymous'})
    const value = { userInfo, setUserInfo }

    return (
        <userContext.Provider value={ value }>
            { children }
        </userContext.Provider>
    )
}

export { userContext, UserProvider }