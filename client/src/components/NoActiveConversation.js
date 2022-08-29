import React from 'react'
import Box from '@mui/material/Box'
import { Typography, Button, Grow, Fade } from '@mui/material'
import { useUser } from '../contexts/userContext'
import { useChat } from '../contexts/chatContext'

import DoneAllIcon from '@mui/icons-material/DoneAll'
import Lottie from 'lottie-react'
import computerAnimation from '../computer-animation.json'


export default function NoActiveConversation() {

  const { chatData, setCurrentConversation } = useChat()

  const joinGeneralChat = () => {
    setCurrentConversation(chatData.conversations.find(conv => conv.name === "General"))
  }

  return (
    <Box sx={{
      flexGrow: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Box sx={{ textAlign: 'center'}}>
        <Lottie style={{ width: 400, maxWidth: '100%'}} animationData={computerAnimation}></Lottie>
        <Typography sx={{ color: 'text.secondary'}}>Welcome to Obscuro</Typography>
        <Button variant="contained" onClick={joinGeneralChat}>Join chat</Button>
      </Box>
    </Box>
  )
}
