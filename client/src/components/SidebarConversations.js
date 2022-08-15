import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import { Avatar, Typography, Badge, Fab, List } from '@mui/material'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add'
import { grey } from '@mui/material/colors'
import { useChat } from '../contexts/chatContext'
import { useUser } from '../contexts/userContext'
import { useSocket } from '../contexts/socketContext'
import { useSidebar } from '../contexts/sidebarContext'
import { useNavigate } from 'react-router-dom'

import SidebarChat from './SidebarChat';

const SidebarConversations = React.forwardRef(({shouldOpenSidebar, setShouldOpenSidebar}, ref) => {
  const { chatData } = useChat()
  const { userID } = useUser()
  const navigate = useNavigate()
  
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

  
  const { publicExpanded, setPublicExpanded, privateExpanded, setPrivateExpanded } = useSidebar()

  return (
    <Box ref={ref} sx={{
      position: 'absolute',
      width: '100%',
      height: '100%',
      display:'flex',
      flexDirection:'column',
    }}>
      <Box sx={{
        overflowY: 'auto',
        flexGrow: 1,
        height: 0
      }}>

        <Accordion onChange={() => setPublicExpanded(prev => !prev)} expanded={publicExpanded}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Badge color="primary" badgeContent={publicNotificationsCount}>
              <Typography fontWeight="light" ml={3} mt={1} variant="h5">Public</Typography>
            </Badge>
          </AccordionSummary>
          <AccordionDetails sx={{padding: 0}}>
              {publicConversations.map(conversation => <SidebarChat key={conversation._id} shouldOpenSidebar={shouldOpenSidebar} setShouldOpenSidebar={setShouldOpenSidebar} conversation={conversation} />)}  
              {publicConversations.length === 0 && <Typography>No public conversations yet</Typography>}
          </AccordionDetails>
        </Accordion>
        
        <Accordion onChange={() => setPrivateExpanded(prev => !prev)} expanded={privateExpanded}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Badge color="primary" badgeContent={privateNotificationsCount}>
              <Typography fontWeight="light" ml={3} mt={1} variant="h5">Private</Typography>
            </Badge>
          </AccordionSummary>
          <AccordionDetails sx={{padding: 0}}>
            {privateConversations.map(conversation => <SidebarChat key={conversation._id} shouldOpenSidebar={shouldOpenSidebar} setShouldOpenSidebar={setShouldOpenSidebar} conversation={conversation} />)}
            {privateConversations.length === 0 && <Typography sx={{ color: 'text.secondary'}} textAlign="center">No private conversations yet</Typography>}
          </AccordionDetails>
        </Accordion>
     
      </Box>
      <Paper elevation={3} sx={{ pb: 2, pt: 1,textAlign: 'center' }}>
        <Typography mt={1} variant="body1" fontWeight="light">Create</Typography>
        <Fab color="primary" variant="contained" onClick={() => navigate('/chat/create-conversation')}>
          <AddIcon />
        </Fab>
      </Paper>
    </Box>
  )
})

export default SidebarConversations