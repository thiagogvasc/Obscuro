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

import { userContext } from '../contexts/userContext'

import { useNavigate } from 'react-router-dom'


function Chat() {
  const [messages, setMessages] = useState([])

  const { userInfo } = useContext(userContext)

  const navigate = useNavigate()

  const chatBottom = useRef(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e) => {
    e.preventDefault()

    const message = e.target.message.value
    if (message) 
      setMessages(arr => [...arr, message])

    e.target.reset()
    e.target.message.focus()
  }

  const logout = () => {
    navigate('/')
  }

  const scrollToBottom = () => {
    chatBottom.current.scrollIntoView()
  }

  return (
        <Box 
          sx={{ 
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: "5vh"
          }}
        >
          <Button sx={{ alignSelf: "start" }} onClick={ logout }><ArrowBackIosNewIcon />Back</Button>
          <Paper
            sx={{
              width: "50vw", 
              height: "50vh", 
              padding: "1vh 1vw",
              overflow: "scroll"
            }}
            elevation={3}
          >
            <Stack sx={{ width: "100%", height: "100%" }} spacing={1} direction="column" alignItems="end">
              {messages.map(message => {
                return (
                  <div>
                    <Typography sx={{ color: userInfo.color }} variant="caption">{ userInfo.username }: </Typography>
                    <Chip label={ message } />
                  </div>
                )
              })}
            <div ref={chatBottom} />
            </Stack>
          </Paper>

          <form onSubmit={ handleSubmit }>
            <Box 
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: "1vw"
              }}
            >
                <Textfield autoComplete="off" name="message" />
                <Button type="submit" variant="contained">Send</Button>

            </Box>
          </form>
        </Box>
  );
}

export default Chat;
