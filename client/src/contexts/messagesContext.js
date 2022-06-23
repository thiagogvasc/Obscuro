import React, { useState, useEffect, createContext, useContext } from 'react'
import { useSocket } from '../contexts/socketContext'
import { useUser } from '../contexts/userContext'


const messagesContext = createContext()

export function MessagesProvider({ children }) {
  const [messages, setMessages] = useState({})
  const socket = useSocket()
  const { user } = useUser()

  const testSomething = () => {
    console.log('test')
  }

  // useEffect(() => {
  //   socket.emitFetchMessages()
  //   socket.onMessages(messages1 => {
  //     console.log(messages1)
  //     setMessages(messages1)
  //   })
  // }, [])

  useEffect(() => {
    socket.onMessage(message => {
      setMessages(currMessages => {
        const currMessagesDraft = {...currMessages}
        if (message.receiver.isRoom) {
          if (!currMessagesDraft[message.receiver.id]) {
            currMessagesDraft[message.receiver.id] = []
          }
          currMessagesDraft[message.receiver.id] = [...currMessagesDraft[message.receiver.id], message]
        } else { // is private message
          if (!currMessagesDraft[message.sender.id])
            currMessagesDraft[message.sender.id] = []
          currMessagesDraft[message.sender.id] = [...currMessagesDraft[message.sender.id], message]

          if (!currMessagesDraft[message.receiver.id])
          currMessagesDraft[message.receiver.id] = []
          if (message.sender.id === user.id) {
            currMessagesDraft[message.receiver.id] = [...currMessagesDraft[message.receiver.id], message]
          }
        }
        return currMessagesDraft
      })
    })
  }, [])

  const value = {
    messages,
    testSomething
  }

  return (
      <messagesContext.Provider value={ value }>
          { children }
      </messagesContext.Provider>
  )
}

export const useMessages = () => {
    return useContext(messagesContext)
}
