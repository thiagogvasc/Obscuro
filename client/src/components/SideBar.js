import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Box from '@mui/material/Box'

import SidebarChat from './SidebarChat'
import SidebarUser from './SidebarUser'
import { Typography } from '@mui/material'
import { grey } from '@mui/material/colors'

import { useChat } from '../contexts/chatContext'
import { useUsers } from '../contexts/usersContext'

export default function Sidebar({ shouldOpenSidebar, setShouldOpenSidebar }) {
  console.log('Sidebar')
  const navigate = useNavigate()
  const { chatData } = useChat()
  const { users } = useUsers()
  console.log(users)

  const [tab, setTab] = useState('users')
  const handleChange = (e, newValue) => {
    console.log('tab change ')

    setTab(newValue)
    //setTab(e.target.value)
  }
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
      

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs variant="fullWidth" value={tab} onChange={handleChange}>
          <Tab label="Conversations" value="conversations" />
          <Tab label="Users" value="users" />
        </Tabs>
      </Box>
      
      { tab === 'conversations' ? 
      <>
        <Typography fontWeight="light" ml={3} mt={1} color="white" variant="h5">Conversations</Typography>
        {chatData.conversations.map(conversation => <SidebarChat key={conversation._id} shouldOpenSidebar={shouldOpenSidebar} setShouldOpenSidebar={setShouldOpenSidebar} conversation={conversation} />)}  
        <Button onClick={() => navigate('/create-conversation')}>Start conversation</Button>
      </>
      
      :
      <>
      {console.log(users)}
        <Typography fontWeight="light" ml={3} mt={1} color="white" variant="h5">Users</Typography>
        {users.map(user => <SidebarUser key={user._id} shouldOpenSidebar={shouldOpenSidebar} setShouldOpenSidebar={setShouldOpenSidebar} user={user} />)}  
      </>
      }

    </Paper>
  )
}
