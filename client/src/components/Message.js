import React from 'react'
import Box from '@mui/material/Box'
import { Typography, Grow, Fade } from '@mui/material'
import { useUser } from '../contexts/userContext'
import { useChat } from '../contexts/chatContext'

import DoneAllIcon from '@mui/icons-material/DoneAll'


export default function Message({message}) {
  const { currentConversation } = useChat()
  const { userID } = useUser()


  const getAggregateSender = () => {
    for (const participant of currentConversation.participants) {
      if (participant._id === message.sender) {
        //console.log(participant)
        return participant
      }
    }
  }

  let sender = getAggregateSender()
  const fromSelf = sender._id === userID

  // fix
  //
  let isRead = false
  const exceptSelfFilter = user => user !== userID
  if (fromSelf && currentConversation.isDM && message.readBy.filter(exceptSelfFilter).length > 0) {
    isRead = true
  }

  return (
    <Fade in>
    <Box sx={{
      alignSelf: fromSelf ? 'flex-end' : 'flex-start',
      textAlign: fromSelf ? 'right' : 'left',
    }}>
      <Typography variant="body1">{ sender.username }</Typography>
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
      <Box sx={{ clear: 'both'}}>
        {fromSelf ? isRead ? <DoneAllIcon color="success" /> : null : null}
      </Box>
    </Box>
    </Fade>
  )
}
