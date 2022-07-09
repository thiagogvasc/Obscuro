import React from 'react'

import Box from '@mui/material/Box'
import { Avatar, Typography } from '@mui/material'

import { grey } from '@mui/material/colors'

import { useChat } from '../contexts/chatContext'

export default function SidebarChat({ conversation, shouldOpenSidebar, setShouldOpenSidebar}) {
  const { chatData, currentConversation, setCurrentConversation } = useChat()
  const select = () => {
    setCurrentConversation(conversation)
    // setshouldopensdebar(true)
  }

  const shouldHighlight = conversation._id === currentConversation._id

  const getConvName = () => {
    if (conversation.isDM) {
      const [participant1, participant2] = conversation.participants
      if (participant1._id === chatData._id) { // is self
        return participant2.username
      }
      return participant1.username
    }
    return conversation.name
  }
  
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
        <Typography variant="body1" sx={{ color: '#FFFFFF'}}>{getConvName()}</Typography>
        {/* <Typography variant="body2" sx={{ color: 'darkgray'}}>{lastMessage?.text.length > 10 ? lastMessage?.text.substring(1, 10) + '...' : lastMessage?.text}</Typography> */}
      </Box>
    </Box>
  )
}
