import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Box from '@mui/material/Box'
import AddIcon from '@mui/icons-material/Add'
import Fab from '@mui/material/Fab'
import Slide from '@mui/material/Slide'

import SidebarChat from './SidebarChat'
import SidebarUser from './SidebarUser'
import { Typography } from '@mui/material'
import { TransitionGroup } from 'react-transition-group';

import { useChat } from '../contexts/chatContext'
import { useUsers } from '../contexts/usersContext'

export default function Sidebar({ shouldOpenSidebar, setShouldOpenSidebar }) {
  const navigate = useNavigate()
  const { chatData, currentConversation } = useChat()
  const { users } = useUsers()
  const [tab, setTab] = useState('conversations')
  const containerRef = useRef(null)
  const handleChange = (e, newValue) => {
    setTab(newValue)
  }
  return (
    <Paper ref={containerRef} elevation={2} sx={{ 
      display: 'flex',
      flexDirection: 'column',
      display: {
        xs: shouldOpenSidebar ? "flex":"none", 
        sm: "flex"
      }, 
      // backgroundColor: grey[800],
      width: shouldOpenSidebar ? '100%' : '25%', 
      borderRadius: '25px',
      minWidth: '250px',
      overflow: 'hidden'
    }}>
      

      <Paper elevation={3} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs variant="fullWidth" value={tab} onChange={handleChange}>
          <Tab label="Conversations" value="conversations" />
          <Tab label="Users" value="users" />
        </Tabs>
      </Paper>

      { tab === 'conversations' ? 
        <Slide in direction="right" container={containerRef.current}>
          <Box sx={{
            flexGrow: 1,
            display:'flex',
            flexDirection:'column'
          }}>
            <Box sx={{
              overflowY: 'scroll',
              flexGrow: 1,
              height: 0
            }}>
              
              <Typography fontWeight="light" ml={3} mt={1} /*color="white"*/ variant="h5">Public</Typography>
              {chatData.conversations.filter(conversation => conversation.isPublic).map(conversation => <SidebarChat key={conversation._id} shouldOpenSidebar={shouldOpenSidebar} setShouldOpenSidebar={setShouldOpenSidebar} conversation={conversation} />)}  
              
              <Typography fontWeight="light" ml={3} mt={1} /*color="white"*/ variant="h5">Private</Typography>
              {chatData.conversations.filter(conversation => !conversation.isPublic).map(conversation => <SidebarChat key={conversation._id} shouldOpenSidebar={shouldOpenSidebar} setShouldOpenSidebar={setShouldOpenSidebar} conversation={conversation} />)}
           
            </Box>
            <Paper elevation={3} sx={{ p: 1, textAlign: 'center' }}>
              <Typography mt={1} variant="body1" fontWeight="light">Create</Typography>
              <Fab color="primary" variant="contained" onClick={() => navigate('/chat/create-conversation')}>
                <AddIcon />
              </Fab>
            </Paper>
          </Box>
        </Slide>
      : 
        <>
          <Slide in={tab==='users'} direction="left" container={containerRef.current}>
            <Box sx={{ }}>
              <Typography fontWeight="light" ml={3} mt={1} color="white" variant="h5">Users</Typography>
              {users.map(user => <SidebarUser key={user._id} setTab={setTab} shouldOpenSidebar={shouldOpenSidebar} setShouldOpenSidebar={setShouldOpenSidebar} user={user} />)}  
            </Box>
          </Slide>
        </>
      }

    </Paper>
  )
}
