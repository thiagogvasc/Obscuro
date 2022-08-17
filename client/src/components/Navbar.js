import React from 'react'

import Box from '@mui/material/Box'
import { useUser } from '../contexts/userContext'

import { ButtonGroup, Typography } from '@mui/material'
import { Button } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios'
import { baseUrl } from '../axiosConfig'
import { useNavigate } from 'react-router-dom'
import { grey } from '@mui/material/colors'

export default function Navbar() {
  const user = useUser()
  const navigate = useNavigate()
  const logout = () => {
    axios.delete(`${baseUrl}/auth/logout`, { withCredentials: true }).then(res => {
      console.log(res.data)
      user.setUserID(undefined)
      navigate('/') // login
    }).catch(err => {
      console.log(err)
    })
  }
  const login = () => {
    navigate('/')
  }
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between"}}>
      <Typography display="inline" fontWeight="100" mb={2} variant="h2">Obscuro<Typography fontWeight="300" display="inline" variant="body2" sx={{ p: 1, color: grey[400]}}>(Alpha)</Typography></Typography>
      {/* <Box sx={{ display: 'flex' }}> */}

        <ButtonGroup variant="text" sx={{ alignItems: "center"}}>
          {user.userID && <Button onClick={() => navigate('/chat')}>Chat</Button>}
          {user.userID && <Button onClick={() => navigate('/chat/profile')}>Profile</Button>}
          {user.userID && <Button onClick={logout}><LogoutIcon mr={5}/>Leave</Button>}
          {!user.userID && <Button onClick={login}><LogoutIcon mr={5}/>Login</Button>}
        </ButtonGroup>
      {/* </Box> */}
    </Box>
  )
}
