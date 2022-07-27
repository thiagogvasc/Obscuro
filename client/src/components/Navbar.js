import React from 'react'

import Box from '@mui/material/Box'
import { useUser } from '../contexts/userContext'

import { Typography } from '@mui/material'
import { Button } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout';

import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const user = useUser()
  const navigate = useNavigate()
  const logout = () => {
    axios.delete('http://localhost:8080/auth/logout', { withCredentials: true }).then(res => {
      console.log(res.data)
      user.setUserID(undefined)
      navigate('/') // login
    }).catch(err => {
      console.log(err)
    })
  }
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between"}}>
      <Typography fontWeight="100" mb={2} variant="h2">Obscuro</Typography>
      {user && <Button onClick={logout}><LogoutIcon mr={5}/>Leave</Button>}
    </Box>
  )
}
