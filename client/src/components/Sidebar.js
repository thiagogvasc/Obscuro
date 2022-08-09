import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Box from '@mui/material/Box'
import AddIcon from '@mui/icons-material/Add'
import Fab, { fabClasses } from '@mui/material/Fab'
import Slide from '@mui/material/Slide'
import Collapse from '@mui/material/Collapse'

import SidebarChat from './SidebarChat'
import SidebarUser from './SidebarUser'
import { Typography } from '@mui/material'
import { TransitionGroup } from 'react-transition-group';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useChat } from '../contexts/chatContext'
import { useUsers } from '../contexts/usersContext'
import { useUser } from '../contexts/userContext'
import { grey } from '@mui/material/colors'

import Badge from '@mui/material/Badge';

export default function Sidebar({ shouldOpenSidebar, setShouldOpenSidebar }) {
  const navigate = useNavigate()
  const { chatData, currentConversation } = useChat()
  const { users } = useUsers()
  const { userID } = useUser()
  const [tab, setTab] = useState('conversations')
  const containerRef = useRef(null)
  const handleChange = (e, newValue) => {
    setTab(newValue)
  }

  const publicConversations = []
  const privateConversations = []

  for (const conversation of chatData.conversations) {
    conversation.isPublic ? 
      publicConversations.push(conversation) :
      privateConversations.push(conversation) 
  }

  const getNumberOfUnreadMessages = conversations => {
    let count = 0
    conversations.forEach(conversation => {
      const readMessagesCount = conversation.messages.filter(message => {
        let readByUser = false
        message.read.forEach(read => {
          if (read.by === userID) {
            readByUser = true
          }
        })
        return readByUser
      }).length
      count += (conversation.messages.length - readMessagesCount)
    })
    return count
  }

  const publicNotificationsCount = getNumberOfUnreadMessages(publicConversations)
  const privateNotificationsCount = getNumberOfUnreadMessages(privateConversations)


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
        <Slide in={tab === 'conversations'} appear mountOnEnter unmountOnExit direction="right" container={containerRef.current}>
          <Box sx={{
            flexGrow: 1,
            display:'flex',
            flexDirection:'column'
          }}>
            <Box sx={{
              overflowY: 'auto',
              flexGrow: 1,
              height: 0 
            }}>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Badge color="primary" badgeContent={publicNotificationsCount}>
                    <Typography fontWeight="light" ml={3} mt={1} variant="h5">Public</Typography>
                  </Badge>
                </AccordionSummary>
                <AccordionDetails sx={{padding: 0}}>
                  {/* list here */}
                  {publicConversations.map(conversation => <SidebarChat key={conversation._id} shouldOpenSidebar={shouldOpenSidebar} setShouldOpenSidebar={setShouldOpenSidebar} conversation={conversation} />)}  
                  {publicConversations.length === 0 && <Typography>No public conversations yet</Typography>}
                </AccordionDetails>
              </Accordion>
              
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Badge color="primary" badgeContent={privateNotificationsCount}>
                    <Typography fontWeight="light" ml={3} mt={1} variant="h5">Private</Typography>
                  </Badge>
                </AccordionSummary>
                <AccordionDetails sx={{padding: 0}}>
                  {privateConversations.map(conversation => <SidebarChat key={conversation._id} shouldOpenSidebar={shouldOpenSidebar} setShouldOpenSidebar={setShouldOpenSidebar} conversation={conversation} />)}
                  {privateConversations.length === 0 && <Typography textAlign="center">No private conversations yet</Typography>}
                </AccordionDetails>
              </Accordion>
           
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
        <Slide in={tab === 'users'} appear mountOnEnter unmountOnExit direction="left" orientation="horizontal" container={containerRef.current}>
          <Box sx={{ flexGrow: 1, overflowY: 'auto', height: 0 }}>
            <Typography fontWeight="light" ml={3} mt={1} color="white" variant="h5">Users</Typography>
            {users.map(user => <SidebarUser key={user._id} setTab={setTab} shouldOpenSidebar={shouldOpenSidebar} setShouldOpenSidebar={setShouldOpenSidebar} user={user} />)}  
          </Box>
        </Slide>
      }
    </Paper>
  )
}
