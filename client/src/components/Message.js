import React from 'react'
import Box from '@mui/material/Box'
import { Typography } from '@mui/material'
import { useUser } from '../contexts/userContext'
import { useChat } from '../contexts/chatContext'


export default function Message({message}) {
  const { currentConversation } = useChat()
  const { userID } = useUser()

  const getAggregateSender = () => {
    for (const participant of currentConversation.participants) {
      if (participant._id === message.sender) {
        console.log(participant)
        return participant
      }
    }
  }

  let sender = getAggregateSender()
  const fromSelf = sender._id === userID

  return (
    <Box sx={{
      alignSelf: fromSelf ? 'flex-end' : 'flex-start',
      textAlign: fromSelf ? 'right' : 'left',
    }}>
      <Typography sx={{ /*color: 'white'*/ }} variant="body1">{ sender.username }</Typography>
      <Typography fontWeight="300" variant="body2" sx={{
        backgroundColor: 'primary.main',
        color: 'primary.contrastText',
        borderRadius: '10px',
        p: 1,
        maxWidth: '200px',
        wordWrap: 'break-word',
        float: fromSelf ? 'right' : 'left',
      }}>
        { message.text }
      </Typography>
    </Box>
  )
}
