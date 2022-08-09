import React from 'react'
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'
import Textfield from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import SendIcon from '@mui/icons-material/Send';

import { v4 } from 'uuid'

import { useSocket } from '../contexts/socketContext'

import MessagesWindow from './MessagesWindow'
import ConversationInfo from './ConversationInfo'
import Sidebar from './Sidebar'

import { useChat } from '../contexts/chatContext'
import { useUser } from '../contexts/userContext'
import { grey } from '@mui/material/colors'
import { Fab, Paper, CircularProgress, Slide, Collapse } from '@mui/material'
import SendMessageForm from './SendMessageForm'


function Chat() {
  
  const { 
    chatData,
    setChatData,
    currentConversation,
    setCurrentConversation,
    isLoading
  } = useChat()

  const socket = useSocket()
  const navigate = useNavigate()
  const [shouldOpenSidebar, setShouldOpenSidebar] = useState(false)
  const [openInfo, setOpenInfo] = useState(false)

  const { user } = useUser()

  const handleOpenInfo = () => {
    setOpenInfo(openInfo => !openInfo)
  }

  if (isLoading) {
    return (
      <Box sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2
      }}>
        <CircularProgress/>
        <Typography variant="body1">Loading...</Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{ 
        flexGrow: 1,
        display: "flex",
        flexDirection: "row",
        gap: 3,
        // overflow: 'hidden'
      }}
    >
      <Sidebar shouldOpenSidebar={shouldOpenSidebar} setShouldOpenSidebar={setShouldOpenSidebar}/>
      <Paper elevation={2} sx={{
        flexGrow: 1, 
        display: shouldOpenSidebar ? 'none' : 'flex', 
        borderRadius: '25px',
      }}>
        <Box sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}>
          <Button sx={{
            display: {xs: 'block', sm: 'none'}, 
            alignSelf: "flex-start"}} 
            onClick={() => setShouldOpenSidebar(true)}
          >
            back
          </Button>
          <Paper onClick={handleOpenInfo} square elevation={3} sx={{ 
            textAlign: 'center', 
            p: 1,
            borderTopLeftRadius: '25px',
            borderTopRightRadius: openInfo ? '' : '25px',
            '&:hover': {
              backgroundColor: 'action.hover',
              cursor: 'pointer'
            }
          }}>
            <Typography component="span">
              { currentConversation.name }
            </Typography>
          </Paper>
          <MessagesWindow />
          <SendMessageForm />
        </Box>

        {/* <Collapse mountOnEnter unmountOnExit in={openInfo} orientation='horizontal'><ConversationInfo /></Collapse> */}
        {openInfo && <ConversationInfo />}
      </Paper> 
    </Box>
  );
}

export default Chat;
