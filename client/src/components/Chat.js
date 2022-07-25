import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'
import Textfield from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import SendIcon from '@mui/icons-material/Send';

import { useSocket } from '../contexts/socketContext'

import Sidebar from './Sidebar'
import MessagesWindow from './MessagesWindow'
import ConversationInfo from './ConversationInfo'

import { useChat } from '../contexts/chatContext'
import { grey } from '@mui/material/colors'
import { Fab, Paper, CircularProgress, Slide, Collapse } from '@mui/material'


function Chat() {
  
  const { 
    chatData,
    currentConversation,
    setCurrentConversation,
    isLoading
  } = useChat()

  const socket = useSocket()
  const navigate = useNavigate()
  const [shouldOpenSidebar, setShouldOpenSidebar] = useState(false)
  const [openInfo, setOpenInfo] = useState(false)

  const handleOpenInfo = () => {
    setOpenInfo(openInfo => !openInfo)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const text = e.target.message.value

    if (text !== '') {
      socket.emitMessage({
        text,
        sender: chatData._id,
        conversation: currentConversation._id
      })
    }
    //console.log({text: text, sender: chatData._id, conversation: currentConversation._id})

    e.target.reset()
    e.target.message.focus()
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
        display: shouldOpenSidebar ? 'none' : 'flex', 
        flexGrow: 1, 
        // flexDirection: "column", 
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
          <Paper square elevation={3} sx={{ 
            textAlign: 'center', 
            p: 1
          }}>
            <Typography component="span" onClick={handleOpenInfo}>
              { currentConversation.name }
            </Typography>
          </Paper>
          <MessagesWindow />
          <form onSubmit={ handleSubmit }>
            <Box 
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 2,
                m: 2,
              }}
              >
                <Textfield 
                  autoComplete="off" 
                  color="primary"
                  name="message" 
                  label="Message"
                  fullWidth 
                  InputProps={{ sx: { borderRadius: '25px' }} }
                />
                <Box><Fab type="submit" color="primary" size="large"><SendIcon/></Fab></Box> 
            </Box>
          </form>
        </Box>

        <Collapse mountOnEnter unmountOnExit in={openInfo} orientation='horizontal'><Box><ConversationInfo /></Box></Collapse>
      </Paper>
    </Box>
  );
}

export default Chat;
