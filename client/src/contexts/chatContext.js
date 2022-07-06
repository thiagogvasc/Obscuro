import React, { useState, useEffect, createContext, useContext } from 'react'
import { useSocket } from './socketContext'


const chatContext = createContext()

export function ChatProvider({ children }) {
  const [chatData, setChatData] = useState({conversations: []})
  console.log(chatData)
  const [currentConversation, setCurrentConversation] = useState({name: '', messages: []})
  const socket = useSocket()

  useEffect(() => {
    socket.initConnection()
    socket.emitJoinChat()
    socket.onChatJoined(user => {
      console.log(user)
      setChatData(user)
      setCurrentConversation(user.conversations[0])
    })
    socket.onMessage(message => {
      console.log(message)
      setChatData(prevChatData => {
        const chatDataDraft = { ...prevChatData }
        const conversation = message.conversation
        chatDataDraft.conversations.forEach(conv => {
          if (conv._id === conversation._id) {
            conv.messages.push(message)
          }
        })

        return chatDataDraft
      })
    })
  }, [])

  const value = {
    chatData,
    setChatData,
    currentConversation,
    setCurrentConversation
  }

  return (
    <chatContext.Provider value={ value }>
      { children }
    </chatContext.Provider>
  )
}

export const useChat = () => {
  return useContext(chatContext)
}
