import React from 'react'

import Box from '@mui/material/Box'
import { Avatar, Typography } from '@mui/material'

export default function SidebarChat({chatName, receiver, selectReceiver, isRoom}) {
  const select = () => {
    selectReceiver(receiver, isRoom)
  }
  return (
    // mayve just pass the whole receiver
    <Box onClick={select} sx={{
      display: 'flex',
      '&:hover': {
        backgroundColor: 'black',
        cursor: 'pointer'
      }
    }}>
      <Avatar sx={{
        width: '50px',
        height: '50px',
        m: 2
      }}/>
      <Box sx={{
        alignSelf: 'center',
        fontWeight:'100'
      }}>
        <Typography sx={{ fontWeight: '100', color: '#FFFFFF'}}>{chatName}</Typography>
        <Typography sx={{color: '#FFFFFF'}}>{'last message from chat...'}</Typography>
      </Box>
    </Box>
  )
}
