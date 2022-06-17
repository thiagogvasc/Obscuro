import React, { useEffect } from 'react'

import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'

import SidebarChat from './SidebarChat'
import { Typography } from '@mui/material'
import { useUser } from '../contexts/userContext'
import { grey } from '@mui/material/colors'

export default function Sidebar({currentReceiver, messages, shouldOpenSideBar, users, selectReceiver}) {
  const { user } = useUser()
  const withoutSelfFilter = (userTemp) => userTemp.id !== user.id
  const usersWithoutSelf = users.filter(withoutSelfFilter)
  return (
    <Paper elevation={12} sx={{ 
      display: {
        xs: shouldOpenSideBar ? "block":"none", 
        sm: "block"
      }, 
      backgroundColor: grey[800],
      width: shouldOpenSideBar ? '100%' : '25%', 
      borderRadius: '25px',
    }}>
      <Typography fontWeight="light" ml={3} mt={1} color="white" variant="h5">Rooms</Typography>
      <SidebarChat currentReceiver={currentReceiver} lastMessage={messages['General']?.slice(-1)[0]} selectReceiver={selectReceiver} chatName={'General'} isRoom={true} receiver={'General'}/> 
      {/*pass something else other than receiver*/}
      {usersWithoutSelf.map(user => <SidebarChat currentReceiver={currentReceiver} lastMessage={messages[user.id]?.slice(-1)[0]} selectReceiver={selectReceiver} chatName={user.username} isRoom={false} receiver={user.id}/>)}  
    </Paper>
  )
}
