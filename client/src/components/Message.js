import React, { useState, useRef } from 'react'
import Box from '@mui/material/Box'
import { Typography, Grow, Fade } from '@mui/material'
import { useUser } from '../contexts/userContext'
import { useChat } from '../contexts/chatContext'

import DoneAllIcon from '@mui/icons-material/DoneAll'
import CheckIcon from '@mui/icons-material/Check';
import MessagePopover from './MessagePopover'


export default function Message({message}) {
  const { currentConversation } = useChat()
  const { userID } = useUser()

  let sender = message.sender
  const fromSelf = sender._id === userID

  // fix
  let isRead = false
  const exceptSelfFilter = read => read.by !== userID
  if (fromSelf && currentConversation.isDM && message.read.filter(exceptSelfFilter).length > 0) {
    isRead = true

  }
  const date = new Date(message.sentAt)


  const [open, setOpen] = useState(false)
  const messageRef = useRef(null)

  const handleClick = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const handleMouseEnter = () => {
    setOpen(true)
  }

  const handleMouseLeave = () => {
    setOpen(false)
  }

  return (
    <Fade in>
    <Box sx={{
      alignSelf: fromSelf ? 'flex-end' : 'flex-start',
      textAlign: fromSelf ? 'right' : 'left',
    }}>
      <Typography variant="body1">{ sender.username }</Typography>
      <Box
        ref={messageRef}
        onClick={handleClick} 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{ 
          display: 'flex', 
          backgroundColor: 'primary.main', 
          borderRadius: '10px',
          transition: 'transform 0.1s',
          '&:hover': {
            cursor: 'pointer',
            transform: 'scale(1.05)'
          }
      }}>
        {open && <MessagePopover open={open} anchorEl={messageRef.current} message={message} />}
        <Typography fontWeight="300" variant="body2" sx={{
          p: 1,
          color: 'primary.contrastText',
          maxWidth: '200px',
          wordWrap: 'break-word',
          textAlign: 'left',
        }}>
          { message.text }
        </Typography>
        <Typography variant="caption" fontWeight="300" sx={{ color: 'text.secondary', pr: 1, alignSelf: 'flex-end'}}>{`${date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`}</Typography>
      </Box>
      <Box sx={{ clear: 'both'}}>
        {fromSelf ? isRead ? <DoneAllIcon color="success" /> : message.deliveries.length === 0 ? <CheckIcon /> : <DoneAllIcon /> : null}
      </Box>
    </Box>
    </Fade>
  )
}
