import React, { useState, useEffect, createContext, useContext } from 'react'
import { useSocket } from './socketContext'
import { UserProvider, useUser } from './userContext'


const chatContext = createContext()

export function ChatProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true)
  const [chatData, setChatData] = useState({conversations: []})
  const [currentConversation, setCurrentConversation] = useState({name: '', messages: []})
  const socket = useSocket()
  const { userID } = useUser()
  //console.log(currentConversation)

  // Necessary to update the object reference
  // currentConversation references the chatData.conversations[?] object
  // needs to point to the same object in order to reflect the changes
  useEffect(() => {
    chatData.conversations.forEach(conv => {
      if (conv._id === currentConversation._id) {
        setCurrentConversation(conv)
        console.log('changed reference')
      }
    })
  }, [chatData])

  const getConvName = (conversation) => {
    console.log(conversation)
    console.log(chatData._id)
    if (conversation.isDM) {
      const [participant1, participant2] = conversation.participants
      if (participant1._id === userID) { // is self
        return participant2.username
      }
      return participant1.username
    }
    return conversation.name
  }

  useEffect(() => {
    socket.initConnection()
    socket.emitJoinChat()
    socket.onChatJoined(user => {
      user.conversations.forEach(conversation => {
        conversation.name = getConvName(conversation)
        console.log(conversation.name)
      })
      setChatData(user)
      setCurrentConversation(user.conversations.find(conv => conv.name === 'General'))
      setIsLoading(false)
    })
    socket.onMessage(message => {
      console.log(message)
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
      console.log(conversation)
      setChatData(prevChatData => {
        const chatDataDraft = JSON.parse(JSON.stringify(prevChatData))
        chatDataDraft.conversations.push({...conversation, name: getConvName(conversation)})
        return chatDataDraft
      })
    })

    socket.socketRef.current.on('new-participants', ({conversationID, participants}) => {
      setChatData(prevChatData => {
        const chatDataDraft = JSON.parse(JSON.stringify(prevChatData))
        const conversation = chatDataDraft.conversations.find(conv => conv._id === conversationID)
        conversation.participants.push(...participants)
        return chatDataDraft
      })
    })

    socket.socketRef.current.on('participant-removed', ({conversationID, participant}) => {
      setChatData(prevChatData => {
        const chatDataDraft = JSON.parse(JSON.stringify(prevChatData))
        const conversation = chatDataDraft.conversations.find(conv => conv._id === conversationID)
        conversation.participants = conversation.participants.filter(p => p._id !== participant._id)
        console.log(chatDataDraft)
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
    setCurrentConversation,
    isLoading
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
