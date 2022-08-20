import React, { useContext, useEffect } from 'react'
import { createContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSocket } from './socketContext'
import Login from '../pages/Login'


const infoSidebarContext = createContext({})

export function InfoSidebarProvider({ children }) {
  
  const [openConversationInfo, setOpenConversationInfo] = useState(false)
  const [openMessageInfo, setOpenMessageInfo] = useState(false)

  const [currentMessage, setCurrentMessage] = useState(null)

  const value = {
    openConversationInfo,
    setOpenConversationInfo,
    openMessageInfo,
    setOpenMessageInfo,
    currentMessage,
    setCurrentMessage
  }

  return (
    <infoSidebarContext.Provider value={ value }>
      { children }
    </infoSidebarContext.Provider>
  )
}

export const useInfoSidebar = () => {
  return useContext(infoSidebarContext)
}
