import React from 'react'

import Box from '@mui/material/Box'
import { Avatar, Typography } from '@mui/material'

import { useUser } from '../contexts/userContext'
import { grey } from '@mui/material/colors'

import { useChat } from '../contexts/chatContext'

export default function SidebarChat({ conversation, shouldOpenSidebar, setShouldOpenSidebar}) { 
  const { currentConversation, setCurrentConversation } = useChat()
  const select = () => {
    setCurrentConversation(conversation)
    // setShouldOpenSidebar(true)
    console.log('select')
  }

  // rename to isActive?
  const shouldHighlight = conversation._id === currentConversation._id
  return (
    // mayve just pass the whole receiver
    <Box onClick={select} sx={{
      display: 'flex',
      transition: 'background-color .2s',
      backgroundColor: shouldHighlight ? grey[700] : 'inherit',
      '&:hover': {
        backgroundColor: grey[600],
        cursor: 'pointer'
      }
    }}>
      <Avatar sx={{ width: '50px', height: '50px', m: 2 }}/>
      <Box sx={{ alignSelf: 'center', fontWeight:'100' }}>
        <Typography variant="body1" sx={{ color: '#FFFFFF'}}>{conversation.name}</Typography>
        {/* <Typography variant="body2" sx={{ color: 'darkgray'}}>{lastMessage?.text.length > 10 ? lastMessage?.text.substring(1, 10) + '...' : lastMessage?.text}</Typography> */}
      </Box>
    </Box>
  )
}
