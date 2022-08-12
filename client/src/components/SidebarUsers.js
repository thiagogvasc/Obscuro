import React from 'react'
import { Typography, Box } from '@mui/material'
import { useUsers } from '../contexts/usersContext'
import SidebarUser from './SidebarUser';

const SidebarUsers = React.forwardRef(({shouldOpenSidebar, setShouldOpenSidebar, setTab}, ref) => {
  const { users } = useUsers()
  return (
    <Box ref={ref} sx={{ flexGrow: 1, overflowY: 'auto', width: '100%', height: '100%' }}>
      <Typography fontWeight="light" ml={3} mt={1} color="white" variant="h5">Users</Typography>
      {users.map(user => 
        <SidebarUser 
          key={user._id} 
          setTab={setTab} 
          shouldOpenSidebar={shouldOpenSidebar} 
          setShouldOpenSidebar={setShouldOpenSidebar} 
          user={user} 
        />
      )}  
    </Box>
  )
})

export default SidebarUsers