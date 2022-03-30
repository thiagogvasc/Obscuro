import React from 'react'
import { useState, useEffect, useContext, useRef } from 'react'

import Button from '@mui/material/Button'
import Textfield from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'

import { useUser } from '../contexts/userContext'
import { useSocket } from '../contexts/socketContext'


function Chat() {
  const [messages, setMessages] = useState([])

  const { user, logout } = useUser()
  const socket = useSocket()

  const chatBottom = useRef(null)

  useEffect(() => {
    if (socket != null) {
      socket.onMessage(message => {
        setMessages(arr => [...arr, message])
      })
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e) => {
    e.preventDefault()
    const text = e.target.message.value

    if (text !== '') {
      socket.emitMessage({
        text,
        sender: user.username,
        senderColor: user.color
      })
    }

    e.target.reset()
    e.target.message.focus()
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
      <Stack sx={{ flexGrow: 1, overflowY: "auto" }} spacing={1} direction="column" alignItems="end">
          {messages.map(message => {
            return (
              <>
                <Typography sx={{ color: message.senderColor }} variant="caption">{ message.sender }: </Typography>
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
    </Box>
  );
}

export default Chat;
