import React, { useState, useEffect, createContext, useContext } from 'react'
import { useSocket } from './socketContext'


const chatContext = createContext()

export function ChatProvider({ children }) {
  const [chatData, setChatData] = useState({conversations: []})
  const [currentConversation, setCurrentConversation] = useState({name: '', messages: []})
  const socket = useSocket()

  // Necessary to update the object reference
  // currentConversation references the chatData.conversations[?] object
  // needs to point to the same object in order to reflect the changes
  useEffect(() => {
    chatData.conversations.forEach(conv => {
      if (conv._id === currentConversation._id) {
        setCurrentConversation(conv)
      }
    })
  }, [chatData])

  useEffect(() => {
    socket.initConnection()
    socket.emitJoinChat()
    socket.onChatJoined(user => {
      // console.log(user)
      setChatData(user)
      setCurrentConversation(user.conversations[0])
    })
    socket.onMessage(message => {
      setChatData(prevChatData => {
        const chatDataDraft = JSON.parse(JSON.stringify(prevChatData))
        const conversation = message.conversation
        chatDataDraft.conversations.forEach(conv => {
          if (conv._id === conversation._id) {
            conv.messages.push(message)
          }
        })
        return chatDataDraft
      })
    })

    socket.socketRef.current.on('new-conversation', conversation => {
      setChatData(prevChatData => {
        const chatDataDraft = JSON.parse(JSON.stringify(prevChatData))
        chatDataDraft.conversations.push(conversation)
        const getLastElem = arr => arr[arr.length - 1]
        setCurrentConversation(getLastElem(chatDataDraft.conversations))
        return chatDataDraft
      })
    })

    socket.socketRef.current.on('conversation-opened', ({ conversationID, openedBy }) => {
      setChatData(prevChatData => {
        const chatDataDraft = JSON.parse(JSON.stringify(prevChatData))
        const conversation = chatDataDraft.conversations.find(conversation => conversation._id === conversationID)
        if (conversation) {
          conversation.messages.forEach(message => {
            if (message.readBy.includes(openedBy)) return
            message.readBy.push(openedBy)
          })
        }
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
