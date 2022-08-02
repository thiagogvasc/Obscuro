import React from 'react'
import Box from '@mui/material/Box'
import { Typography, Grow, Fade } from '@mui/material'
import { useUser } from '../contexts/userContext'
import { useChat } from '../contexts/chatContext'

import DoneAllIcon from '@mui/icons-material/DoneAll'


export default function Message({message}) {
  const { currentConversation } = useChat()
  const { userID } = useUser()


  // const getAggregateSender = () => {
  //   for (const participant of currentConversation.participants) {
  //     if (participant._id === message.sender) {
  //       return participant
  //     }
  //   }
  // }

  //let sender = getAggregateSender()
  let sender = message.sender
  const fromSelf = sender._id === userID

  // fix
  //
  let isRead = false
  const exceptSelfFilter = user => user !== userID
  if (fromSelf && currentConversation.isDM && message.readBy.filter(exceptSelfFilter).length > 0) {
    isRead = true

  }
  const date = new Date(message.sentAt)

  return (
    <Fade in>
    <Box sx={{
      alignSelf: fromSelf ? 'flex-end' : 'flex-start',
      textAlign: fromSelf ? 'right' : 'left',
    }}>
      <Typography variant="body1">{ sender.username }</Typography>
      <Box sx={{ display: 'flex', backgroundColor: 'primary.main', borderRadius: '10px' }}>
        <Typography fontWeight="300" variant="body2" sx={{
          p: 1,
          color: 'primary.contrastText',
          maxWidth: '200px',
          wordWrap: 'break-word',
          textAlign: 'left'
        }}>
          { message.text }
        </Typography>
        <Typography noWrap variant="caption" fontWeight="300" sx={{ color: 'text.secondary', pr: 1, alignSelf: 'flex-end'}}>{`${date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`}</Typography>
      </Box>
      <Box sx={{ clear: 'both'}}>
        {fromSelf ? isRead ? <DoneAllIcon color="success" /> : null : null}
      </Box>
    </Box>
    </Fade>
  )
}
