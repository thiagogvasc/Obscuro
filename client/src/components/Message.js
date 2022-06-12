import React from 'react'

import Box from '@mui/material/Box'
import { useUser } from '../contexts/userContext'

import { Typography } from '@mui/material'
import { Button } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout';

export default function Message({message, user}) {
  return (
    <Box sx={{
      alignSelf: message.sender.id === user.id ? 'flex-end' : 'flex-start',
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
}
