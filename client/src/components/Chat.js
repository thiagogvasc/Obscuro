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

import { useChat } from '../contexts/chatContext'
import { grey } from '@mui/material/colors'
import { Fab, Paper, CircularProgress } from '@mui/material'


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
        flexDirection: "column", 
        borderRadius: '25px',
        overflow: 'hidden'
      }}>
        <Button sx={{
          display: {xs: 'block', sm: 'none'}, 
          alignSelf: "flex-start"}} 
          onClick={() => setShouldOpenSidebar(true)}
        >
          back
        </Button>
        <Paper elevation={3} sx={{ 
          textAlign: 'center', 
          // color: 'white',
          p: 1
        }}>
          <Typography sx={{color: 'getContrastText()'}} variant="h5">
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
              {/* <Button sx={{minWidth: '50px', minHeight: '50px', borderRadius: '50%'}} type="submit" variant="contained"><SendIcon/></Button> */}
              <Box><Fab type="submit" color="primary" size="large"><SendIcon/></Fab></Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

export default Chat;
