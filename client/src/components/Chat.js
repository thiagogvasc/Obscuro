import React from 'react'
import { useState, useEffect, useContext, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'
import Textfield from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import SendIcon from '@mui/icons-material/Send';

import { useUser } from '../contexts/userContext'
import { useSocket } from '../contexts/socketContext'

import Sidebar from './Sidebar'
import Message from './Message'

import { useMessages } from '../hooks/useMessages'
import { useUsers } from '../hooks/useUsers'


function Chat() {
  const { messages } = useMessages()
  const [currentRoomMessages, setCurrentRoomMessages] = useState([])
  const [receiver, setReceiver] = useState({id: 'general', chatName: 'general', isRoom: true})
  const { users } = useUsers()
  const { user } = useUser()
  const socket = useSocket()
  const chatBottom = useRef(null)
  const navigate = useNavigate()
  const [shouldOpenSideBar, setShouldOpenSideBar] = useState(false)

  useEffect(() => {
    if (socket.connectError?.message === 'invalid session') {
      console.log('chat invalid redirect')
      navigate('/')
    }
  })

  useEffect(() => {
      setCurrentRoomMessages(messages[receiver.id] || [])
  }, [receiver, messages])

  useEffect(() => {
    scrollToBottom()
  }, [currentRoomMessages])

  const handleSubmit = (e) => {
    e.preventDefault()
    const text = e.target.message.value

    if (text !== '') {
      socket.emitMessage({
        text,
        sender: user,
        receiver
      })
    }

    e.target.reset()
    e.target.message.focus()
  }

  const selectReceiver = (id, isRoom) => {
    //socket.joinRoom(id) // test
    setReceiver({id, isRoom})
    setShouldOpenSideBar(false)
  }

  const scrollToBottom = () => {
    chatBottom.current.scrollIntoView()
  }

  const getUsername = (id) => {
    let username = ''
    users.forEach(user => {
      if (user.id === id) {
        username = user.username
      }
    })
    return username
  }

  return (
    <Box 
      sx={{ 
        flexGrow: 1,
        display: "flex",
        flexDirection: "row",
        overflowY: "auto",
        gap: 3
      }}
    >
      <Sidebar 
        currentReceiver={receiver} 
        messages={messages} 
        shouldOpenSideBar={shouldOpenSideBar} 
        users={users} 
        selectReceiver={selectReceiver} 
      />
      <Box sx={{
        display: shouldOpenSideBar ? 'none' : 'flex', 
        flexGrow: 1, 
        flexDirection: "column", 
        backgroundColor: '#3E3E42', 
        borderRadius: '25px'
      }}>
        <Button sx={{
          display: {xs: 'block', sm: 'none'}, 
          alignSelf: "flex-start"}} 
          onClick={() => setShouldOpenSideBar(true)}
        >
          back
        </Button>
        <Box sx={{ 
          backgroundColor: 'dimgray', 
          textAlign: 'center', 
          color: 'white'
        }}>
          <Typography variant="h5">
            {receiver.isRoom ? receiver.id : getUsername(receiver.id)}
          </Typography>
        </Box>
        <Stack 
          spacing={1} 
          direction="column" 
          alignItems="end"
          sx={{ 
            p: 5, 
            flexGrow: 1, 
            overflowY: "scroll",
          }} 
        >
            {currentRoomMessages.map(message => {
              return (<Message message={message} user={user}/>)
            })}
          <div ref={ chatBottom } />
        </Stack>
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
                name="message" 
                variant="outlined" 
                fullWidth 
                InputProps={{
                  sx: {
                    color: 'black',
                    backgroundColor: 'white',
                    borderRadius: '25px'
                  }
                }}
              />
              <Button sx={{minWidth: '50px', minHeight: '50px', borderRadius: '50%'}} type="submit" variant="contained"><SendIcon/></Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
}

export default Chat;
