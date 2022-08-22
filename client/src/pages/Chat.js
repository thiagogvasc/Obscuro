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

import MessagesWindow from '../components/MessagesWindow'
import ConversationInfo from '../components/ConversationInfo'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

import { useChat } from '../contexts/chatContext'
import { useUser } from '../contexts/userContext'
import { useInfoSidebar } from '../contexts/infoSidebarContext'
import { grey } from '@mui/material/colors'
import { Fab, Paper, CircularProgress, Slide, Collapse } from '@mui/material'
import SendMessageForm from '../components/SendMessageForm'
import MuiAvatar from '@mui/material/Avatar'
import ConversationAvatar from '../components/ConversationAvatar'
import UserAvatar from '../components/UserAvatar'
import MessageInfo from '../components/MessageInfo'


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
  //const [openInfo, setOpenInfo] = useState(false)

  const {
    openConversationInfo,
    setOpenConversationInfo,
    openMessageInfo,
    setOpenMessageInfo,
    currentMessage
  } = useInfoSidebar()

  const { user, userID } = useUser()

  const handleOpenInfo = () => {
    setOpenConversationInfo(prev => !prev)
    setOpenMessageInfo(false)
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
    <Paper square sx={{ 
			display: "flex", 
			flexDirection: "column", 
			width: "100vw", 
			height: "100vh", 
			padding: '2vh 5vw' 
		}}>
			<Navbar />
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
              borderTopRightRadius: openConversationInfo || openMessageInfo ? '' : '25px',
              '&:hover': {
                backgroundColor: 'action.hover',
                cursor: 'pointer'
              },
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 1
            }}>
              <MuiAvatar sx={{ border: 2, borderColor: 'primary.light', backgroundColor: 'inherit'}}>
                {currentConversation.isDM ? <UserAvatar user={currentConversation.participants.find(u => u._id !== userID)} /> : <ConversationAvatar />}
              </MuiAvatar>
              <Typography component="span">
                { currentConversation.name }
              </Typography>
            </Paper>
            <MessagesWindow />
            <SendMessageForm />
          </Box>

          {/* <Collapse mountOnEnter unmountOnExit in={openInfo} orientation='horizontal'><ConversationInfo /></Collapse> */}
          {openConversationInfo && <ConversationInfo />}
          {openMessageInfo && <MessageInfo message={currentMessage}/>}
        </Paper> 
      </Box>
    </Paper>
  );
}

export default Chat;
