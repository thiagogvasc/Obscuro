import React, {useEffect, useRef} from 'react'

import Box from '@mui/material/Box'
import { Stack, Typography } from '@mui/material'
import { Button } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout';
import { useChat } from '../contexts/chatContext'
import Message from '../components/Message'

export default function MessagesWindow() {
  const { currentConversation } = useChat()
  const chatBottom = useRef(null)

  useEffect(() => {
    chatBottom.current.scrollIntoView()
  })
  
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
