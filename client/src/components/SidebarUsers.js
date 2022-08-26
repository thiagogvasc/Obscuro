import React from 'react'
import { Typography, Box } from '@mui/material'
import { useUsers } from '../contexts/usersContext'
import SidebarUser from './SidebarUser';

const SidebarUsers = React.forwardRef(({shouldOpenSidebar, setShouldOpenSidebar}, ref) => {
  const { users } = useUsers()
  return (
    <Box ref={ref} sx={{ position: 'absolute', overflowY: 'auto', width: '100%', height: '100%' }}>
      {users.map(user => 
        <SidebarUser 
          key={user._id} 
          shouldOpenSidebar={shouldOpenSidebar} 
          setShouldOpenSidebar={setShouldOpenSidebar} 
          user={user} 
        />
      )}  
      {users.length === 0 && <Typography sx={{ mt: 2, color: 'text.secondary'}} textAlign="center">No users yet</Typography>}
    </Box>
  )
})

export default SidebarUsers