import React from 'react'

import Box from '@mui/material/Box'

import SidebarChat from './SidebarChat'
import { Typography } from '@mui/material'

export default function Sidebar({users, selectReceiver}) {
  return (
    <Box sx={{ backgroundColor: '#3E3E42', width: '25%', borderRadius: '25px'}}>
      <Typography fontWeight="light" ml={3} mt={1} color="white" variant="h5">Rooms</Typography>
      <SidebarChat selectReceiver={selectReceiver} chatName={'general'} isRoom={true} receiver={'general'}/>
      {users.map(user => <SidebarChat selectReceiver={selectReceiver} chatName={user.username} isRoom={false} receiver={user.id}/>)}  
    </Box>
  )
}
