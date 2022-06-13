import React from 'react'

import Box from '@mui/material/Box'
import { Avatar, Typography } from '@mui/material'

import {useUser} from '../contexts/userContext'

export default function SidebarChat({currentReceiver, lastMessage, chatName, receiver, selectReceiver, isRoom}) { 
  const select = () => {
    selectReceiver(receiver, isRoom)
  }

  const shouldHighlight = (currentReceiver.id === receiver)
  return (
    // mayve just pass the whole receiver
    <Box onClick={select} sx={{
      display: 'flex',
      transition: 'background-color .2s',
      backgroundColor: shouldHighlight ? 'dimgray' : 'inherit',
      '&:hover': {
        backgroundColor: 'dimgray',
        cursor: 'pointer'
      }
    }}>
      <Avatar sx={{ width: '50px', height: '50px', m: 2 }}/>
      <Box sx={{ alignSelf: 'center', fontWeight:'100' }}>
        <Typography variant="body1" sx={{ color: '#FFFFFF'}}>{chatName}</Typography>
        <Typography variant="body2" sx={{ color: 'darkgray'}}>{lastMessage?.text.length > 10 ? lastMessage?.text.substring(1, 10) + '...' : lastMessage?.text}</Typography>
      </Box>
    </Box>
  )
}
