import React from 'react'

import Box from '@mui/material/Box'
import { Avatar, Typography, Button, Fab } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'


import { grey } from '@mui/material/colors'

import { useSocket } from '../contexts/socketContext'
import { useChat } from '../contexts/chatContext'

export default function SidebarUser({ user, setTab, shouldOpenSidebar, setShouldOpenSidebar}) {
  const { chatData, setChatData, setCurrentConversation } = useChat()
  const socket = useSocket()

  const select = () => {
    for (const conversation of chatData.conversations) {
      if (conversation.isDM) {
        const [participant1, participant2] = conversation.participants
        if ((participant1._id === chatData._id && participant2._id === user._id)
            || (participant1._id === user._id && participant2._id === chatData._id)) {
          setTab('conversations')
          setCurrentConversation({
            ...conversation,
            name: participant1._id === chatData._id ? participant2.username : participant1.username
          })
          return
        }
      }
    }

    const newConversation = {
      name: '',
      isPublic: false,
      isDM: true, 
      participants: [chatData._id, user._id]
    }
    socket.emitCreateConversation(newConversation)
    // setCurrentConversation here
    setTab('conversations')
  }

  // rename to isActive?
  return (
    // mayve just pass the whole receiver
    <Box onClick={select} sx={{
      display: 'flex'
    }}>
      <Avatar sx={{ width: '50px', height: '50px', m: 2 }}/>
      <Box sx={{ alignSelf: 'center', fontWeight:'100' }}>
        <Typography variant="body1" sx={{ color: '#FFFFFF'}}>{user.username}</Typography>
        <Fab color="primary" size="small" variant="extended"><SendIcon/>Send message</Fab>
      </Box>
    </Box>
  )
}
