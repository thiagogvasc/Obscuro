import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'
import Textfield from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import SendIcon from '@mui/icons-material/Send';

import { useSocket } from '../contexts/socketContext'

import MessagesWindow from './MessagesWindow'
import ConversationInfo from './ConversationInfo'
import Sidebar from './Sidebar'

import { useChat } from '../contexts/chatContext'
import { useUser } from '../contexts/userContext'
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

  const { user } = useUser()

  const handleOpenInfo = () => {
    setOpenInfo(openInfo => !openInfo)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const text = e.target.message.value

    if (text !== '') {
      socket.emitMessage({
        text,
        sender: {
          _id: user._id,
          username: user.username
        },
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
  console.log(user._id) // fix user issue
  const notInConversation = (!currentConversation.participants.find(p => p._id === user._id))

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
          <Paper square elevation={3} sx={{ 
            textAlign: 'center', 
            p: 1,
            borderTopLeftRadius: '25px',
            borderTopRightRadius: openInfo ? '' : '25px',
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
                  disabled={notInConversation}
                  autoComplete="off" 
                  color="primary"
                  name="message" 
                  label="Message"
                  fullWidth 
                  InputProps={{ sx: { borderRadius: '25px' }} }
                />
                <Box><Fab disabled={notInConversation} type="submit" color="primary" size="large"><SendIcon/></Fab></Box> 
            </Box>
          </form>
        </Box>

        {/* <Collapse mountOnEnter unmountOnExit in={openInfo} orientation='horizontal'><ConversationInfo /></Collapse> */}
        {openInfo && <ConversationInfo />}
      </Paper> 
    </Box>
  );
}

export default Chat;
