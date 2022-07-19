import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Box from '@mui/material/Box'
import AddIcon from '@mui/icons-material/Add'
import Fab from '@mui/material/Fab'

import SidebarChat from './SidebarChat'
import SidebarUser from './SidebarUser'
import { Typography } from '@mui/material'
import { grey } from '@mui/material/colors'

import { useChat } from '../contexts/chatContext'
import { useUsers } from '../contexts/usersContext'

export default function Sidebar({ shouldOpenSidebar, setShouldOpenSidebar }) {
  const navigate = useNavigate()
  const { chatData, currentConversation } = useChat()
  const { users } = useUsers()
  const [tab, setTab] = useState('conversations')
  const handleChange = (e, newValue) => {
    setTab(newValue)
  }
  return (
    <Paper elevation={2} sx={{ 
      display: {
        xs: shouldOpenSidebar ? "block":"none", 
        sm: "block"
      }, 
      // backgroundColor: grey[800],
      width: shouldOpenSidebar ? '100%' : '25%', 
      borderRadius: '25px',
      minWidth: '250px'
    }}>
      

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs variant="fullWidth" value={tab} onChange={handleChange}>
          <Tab label="Conversations" value="conversations" />
          <Tab label="Users" value="users" />
        </Tabs>
      </Box>
      
      { tab === 'conversations' ? 
      <>
        <Typography fontWeight="light" ml={3} mt={1} /*color="white"*/ variant="h5">Public</Typography>
        {chatData.conversations.filter(conversation => conversation.isPublic).map(conversation => <SidebarChat key={conversation._id} shouldOpenSidebar={shouldOpenSidebar} setShouldOpenSidebar={setShouldOpenSidebar} conversation={conversation} />)}  
        
        <Typography fontWeight="light" ml={3} mt={1} /*color="white"*/ variant="h5">Private</Typography>
        {chatData.conversations.filter(conversation => !conversation.isPublic).map(conversation => <SidebarChat key={conversation._id} shouldOpenSidebar={shouldOpenSidebar} setShouldOpenSidebar={setShouldOpenSidebar} conversation={conversation} />)}
        
        
        <Box textAlign="center">
          <Typography mt={1} variant="body1" fontWeight="light">Create</Typography>
          <Fab color="primary" variant="contained" onClick={() => navigate('/chat/create-conversation')}>
            <AddIcon />
          </Fab>
        </Box>
      </>
      
      :
      <>
        <Typography fontWeight="light" ml={3} mt={1} color="white" variant="h5">Users</Typography>
        {users.map(user => <SidebarUser key={user._id} setTab={setTab} shouldOpenSidebar={shouldOpenSidebar} setShouldOpenSidebar={setShouldOpenSidebar} user={user} />)}  
      </>
      }

    </Paper>
  )
}
