import React, { useEffect } from 'react'

import Box from '@mui/material/Box'

import SidebarChat from './SidebarChat'
import { Typography } from '@mui/material'

export default function Sidebar({messages, shouldOpenSideBar, users, selectReceiver}) {
  return (
    <Box sx={{ 
      display: {
        xs: shouldOpenSideBar ? "block":"none", 
        sm: "block"
      }, 
      backgroundColor: '#3E3E42', 
      width: shouldOpenSideBar ? '100%' : '25%', 
      borderRadius: '25px'  
    }}>
      <Typography fontWeight="light" ml={3} mt={1} color="white" variant="h5">Rooms</Typography>
      <SidebarChat lastMessage={messages['general']?.slice(-1)[0]} selectReceiver={selectReceiver} chatName={'general'} isRoom={true} receiver={'general'}/>
      {users.map(user => <SidebarChat lastMessage={messages[user.id]?.slice(-1)[0]} selectReceiver={selectReceiver} chatName={user.username} isRoom={false} receiver={user.id}/>)}  
    </Box>
  )
}
