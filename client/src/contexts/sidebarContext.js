import React, { useContext, useEffect } from 'react'
import { createContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSocket } from './socketContext'
import Login from '../pages/Login'


const sidebarContext = createContext({})

export function SidebarProvider({ children }) {
  const [tab, setTab] = useState('conversations')
  const [publicExpanded, setPublicExpanded] = useState(true)
  const [privateExpanded, setPrivateExpanded] = useState(false)
    
  const value = {
    tab,
    setTab,
    publicExpanded,
    setPublicExpanded,
    privateExpanded,
    setPrivateExpanded
  }

  return (
      <sidebarContext.Provider value={ value }>
          { children }
      </sidebarContext.Provider>
  )
}

export const useSidebar = () => {
  return useContext(sidebarContext)
}
