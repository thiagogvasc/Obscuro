import React, {useEffect, useLayoutEffect, useRef} from 'react'

import { Stack } from '@mui/material'
import { useChat } from '../contexts/chatContext'
import Message from '../components/Message'
import InfoMessage from '../components/InfoMessage'
import { useSocket } from '../contexts/socketContext'
import { useUser } from '../contexts/userContext'

export default function MessagesWindow() {
  const { currentConversation } = useChat()
  const chatBottom = useRef(null)
  const stackRef = useRef(null)
  const socket = useSocket()
  const { userID } = useUser()

  // scroll before render when conversation changes
  useLayoutEffect(() => {
    stackRef.current.scrollTo({
      top: stackRef.current.scrollHeight,
      behavior: 'instant'
    })
  }, [currentConversation._id])

  // useReadReceits
  useEffect(() => {
    // if there are new messages not read
    const messagesNotRead = currentConversation.messages.filter(message => {
      if (message.read.length === 0) return true
      const read = message.read.find(read => read.by === userID)
      if (read) return false

      return true
    })
    console.log(messagesNotRead)
    currentConversation.messages.map(message => {
      // if (message.read.by.includes(userID)) return message

      if (messagesNotRead.find(m => m._id === message._id)) return
      console.log('got here')
      return {
        ...message,
        read: [...message.read, { by: userID, at: new Date() }]
      }
    })

    // if at least one message not read
    //if (!currentConversation.isDM) return
    console.log(messagesNotRead)
    if (messagesNotRead.length >= 1) { 
      console.log('emitttinggg')
      socket.socketRef.current.emit('conversation-opened', {
        conversationID: currentConversation._id,
        openedBy: {
          by: userID,
          at: new Date()
        }
      })
    }
  }, [currentConversation])

  useEffect(() => chatBottom.current.scrollIntoView())
  
  return (
    <Stack 
      ref={stackRef}
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
          return (message.isInfo ? <InfoMessage key={message._id} message={message} /> : <Message key={message._id} message={message}/>)
        })}
        <div ref={ chatBottom } />
    </Stack>
  )
}
