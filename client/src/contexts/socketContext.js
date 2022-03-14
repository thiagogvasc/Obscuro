import React from 'react'
import { createContext, useState } from 'react'


const socketContext = createContext({})

function SocketProvider({ children }) {

    const [socket, setSocket] = useState(null)
    const value = { socket, setSocket }

    return (
        <socketContext.Provider value={ value }>
            { children }
        </socketContext.Provider>
    )
}

export { socketContext, SocketProvider }