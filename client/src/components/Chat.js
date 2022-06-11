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


function Chat() {
  const [messages, setMessages] = useState({})
  const [currentRoomMessages, setCurrentRoomMessages] = useState([])
  const [receiver, setReceiver] = useState({id: 'general', isRoom: true})
  const [users, setUsers] = useState([])
  const { user } = useUser()
  const socket = useSocket()
  const chatBottom = useRef(null)
  const navigate = useNavigate()

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
    socket.onMessage(message => {
      setMessages(currMessages => {
        const currMessagesDraft = {...currMessages}
        if (message.receiver.isRoom) {
          if (!currMessagesDraft[message.receiver.id]) {
            currMessagesDraft[message.receiver.id] = []
          }
          currMessagesDraft[message.receiver.id] = [...currMessagesDraft[message.receiver.id], message]
        } else { // is private message
          if (!currMessagesDraft[message.sender.id])
            currMessagesDraft[message.sender.id] = []
          currMessagesDraft[message.sender.id] = [...currMessagesDraft[message.sender.id], message]

          if (!currMessagesDraft[message.receiver.id])
          currMessagesDraft[message.receiver.id] = []
          if (message.sender.id === user.id) {
            currMessagesDraft[message.receiver.id] = [...currMessagesDraft[message.receiver.id], message]
          }
        }
        return currMessagesDraft
      })
    })
    socket.onUsers(users => {
      console.log('got users')
      console.log(users)
      setUsers(users)
    })
    
    socket.joinRoom('general')
  }, [])

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
  }

  const scrollToBottom = () => {
    chatBottom.current.scrollIntoView()
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
      <Sidebar users={users} selectReceiver={selectReceiver} />
      <Box sx={{ display: "flex", flexGrow: 1, flexDirection: "column", backgroundColor: '#3E3E42', borderRadius: '25px'}}>
        <Stack sx={{ p: 5, flexGrow: 1, overflowY: "scroll" }} spacing={1} direction="column" alignItems="end">
            {currentRoomMessages.map(message => {
              return (
                <Box sx={{
                  alignSelf: message.sender.id === user.id ? 'end' : 'start',
                  textAlign: message.sender.id === user.id ? 'right' : 'left',
                }}>
                  <Typography sx={{color: 'white'/*color: message.sender.color */}} variant="body1">{ message.sender.username }: </Typography>
                  <Typography fontWeight="300" variant="body2" sx={{
                    backgroundColor: '#1976d2',
                    color: 'white',
                    borderRadius: '10px',
                    p: 1,
                    maxWidth: '200px',
                    wordWrap: 'break-word',
                    float: message.sender.id === user.id ? 'right' : 'left',
                  }}>
                    { message.text }
                  </Typography>
                 
                </Box>
              )
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
              <Textfield autoComplete="off" name="message" variant="outlined" fullWidth 
              InputProps={{
                sx: {
                  color: 'black',
                  backgroundColor: 'white',
                  borderRadius: '25px'
                }
              }}/>
              <Button sx={{minWidth: '50px', minHeight: '50px', borderRadius: '50%'}} type="submit" variant="contained"><SendIcon/></Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
}

export default Chat;
