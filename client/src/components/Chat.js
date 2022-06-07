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

import { useUser } from '../contexts/userContext'
import { useSocket } from '../contexts/socketContext'

import SideBar from '../components/SideBar'


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
    // when receive message, set it on a variable, then when user box is clicked it 
    // just renders it on the chat
    // socket.onMessages(messages => {
    //   console.log(messages)
    //   setMessages(messages)
    // })
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
        flexDirection: "column",
        border: "5px solid black",
        padding: "5vh 5vw",
        overflowY: "auto"
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <SideBar users={users} selectReceiver={selectReceiver} />
        </Grid>
        <Grid item xs={8}>
          <Stack sx={{ flexGrow: 1, overflowY: "auto" }} spacing={1} direction="column" alignItems="end">
              {currentRoomMessages.map(message => {
                return (
                  <>
                    <Typography sx={{ color: message.sender.color }} variant="caption">{ message.sender.username }: </Typography>
                    <Chip label={ message.text } />
                  </>
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
                gap: 2
              }}
            >
                <Textfield autoComplete="off" name="message" fullWidth />
                <Button type="submit" variant="contained">Send</Button>
            </Box>
          </form>
          
        </Grid>
      </Grid>


    </Box>
  );
}

export default Chat;
