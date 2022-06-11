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
      transition: 'background-color .2s',
      '&:hover': {
        backgroundColor: 'dimgray',
        cursor: 'pointer'
      }
    }}>
      <Avatar sx={{ width: '50px', height: '50px', m: 2 }}/>
      <Box sx={{ alignSelf: 'center', fontWeight:'100' }}>
        <Typography variant="body1" sx={{ color: '#FFFFFF'}}>{chatName}</Typography>
        <Typography variant="body2" sx={{ color: 'darkgray'}}>{'last message from chat...'}</Typography>
      </Box>
    </Box>
  )
}
