import React from 'react'

import Box from '@mui/material/Box'
import { useUser } from '../contexts/userContext'

import { Typography } from '@mui/material'
import { Button } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout';

export default function Navbar() {
  const user = useUser()
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between"}}>
      <Typography fontWeight="100" mb={2} variant="h2">Obscuro</Typography>
      {user && <Button onClick={user.logout}><LogoutIcon mr={5}/>Leave</Button>}
    </Box>
  )
}
