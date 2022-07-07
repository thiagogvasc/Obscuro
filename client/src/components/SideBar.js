import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'

import SidebarChat from './SidebarChat'
import { Typography } from '@mui/material'
import { useUser } from '../contexts/userContext'
import { grey } from '@mui/material/colors'

import { useChat } from '../contexts/chatContext'

export default function Sidebar({ shouldOpenSidebar, setShouldOpenSidebar }) {
  const navigate = useNavigate()
  const { chatData } = useChat()
  return (
    <Paper elevation={12} sx={{ 
      display: {
        xs: shouldOpenSidebar ? "block":"none", 
        sm: "block"
      }, 
      backgroundColor: grey[800],
      width: shouldOpenSidebar ? '100%' : '25%', 
      borderRadius: '25px',
    }}>
      <Typography fontWeight="light" ml={3} mt={1} color="white" variant="h5">Rooms</Typography>
      {chatData.conversations.map(conversation => <SidebarChat key={conversation._id} shouldOpenSidebar={shouldOpenSidebar} setShouldOpenSidebar={setShouldOpenSidebar} conversation={conversation} />)}  
      <Button onClick={() => navigate('/create-conversation')}>Start conversation</Button>
    </Paper>
  )
}
