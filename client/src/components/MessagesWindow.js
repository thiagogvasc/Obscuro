import React, {useEffect, useRef} from 'react'

import { Stack } from '@mui/material'
import { useChat } from '../contexts/chatContext'
import Message from '../components/Message'
import axios from 'axios'
import { useSocket } from '../contexts/socketContext'
import { useUser } from '../contexts/userContext'

export default function MessagesWindow() {
  const { currentConversation } = useChat()
  const chatBottom = useRef(null)
  const socket = useSocket()
  const { userID } = useUser()

  // useReadReceits
  useEffect(() => {
    // if there are new messages not read
    const messageNotRead = currentConversation.messages.find(message => !message.readBy.includes(userID))
    currentConversation.messages.map(message => {
      if (message.readBy.includes(userID)) return message
      return {
        ...message,
        readBy: [...message.readBy, userID]
      }
    })

    // if at least one message not read
    if (messageNotRead) { 
      socket.socketRef.current.emit('conversation-opened', {
        conversationID: currentConversation._id,
        openedBy: userID
      })
    }
  }, [currentConversation])

  useEffect(() => chatBottom.current.scrollIntoView())
  
  return (
    <Stack 
      spacing={1} 
      direction="column" 
      alignItems="end"
      height={0} // Allows overflow to scroll
      sx={{ 
        p: 5, 
        flexGrow: 1, 
        overflowY: "scroll",
        scrollBehavior: 'smooth'
      }} 
    >
        {currentConversation.messages.map(message => {
          return (<Message key={message._id} message={message}/>)
        })}
        <div ref={ chatBottom } />
    </Stack>
  )
}
