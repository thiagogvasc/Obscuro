import { useState, useEffect } from 'react'
import { useSocket } from '../contexts/socketContext'
import { useUser } from '../contexts/userContext'

export function useMessages() {
  const [messages, setMessages] = useState({})
  const socket = useSocket()
  const { user } = useUser()

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

  return { messages }
}