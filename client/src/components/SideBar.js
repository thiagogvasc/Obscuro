import React, { useEffect } from 'react'

import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'

import SidebarChat from './SidebarChat'
import { Typography } from '@mui/material'
import { useUser } from '../contexts/userContext'
import { grey } from '@mui/material/colors'

import { useChat } from '../contexts/chatContext'

export default function Sidebar({ shouldOpenSideBar }) {
  const { chatData, setCurrentConversation } = useChat()
  return (
    <Paper elevation={12} sx={{ 
      display: {
        xs: shouldOpenSideBar ? "block":"none", 
        sm: "block"
      }, 
      backgroundColor: grey[800],
      width: shouldOpenSideBar ? '100%' : '25%', 
      borderRadius: '25px',
    }}>
      <Typography fontWeight="light" ml={3} mt={1} color="white" variant="h5">Rooms</Typography>
      {/* <SidebarChat isRoom={true} receiver={'General'}/>  */}
      {/*pass something else other than receiver*/}
      {chatData.conversations.map(conversation => <SidebarChat conversation={conversation} />)}  
    </Paper>
  )
}
