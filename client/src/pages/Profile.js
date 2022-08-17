import React, { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { useUser } from '../contexts/userContext'
import { Paper } from '@mui/material'
import Navbar from '../components/Navbar'
import MuiAvatar from '@mui/material/Avatar'
import UserAvatar from '../components/UserAvatar'
import ChangeAvatarModal from '../components/ChangeAvatarModal'
import axios from 'axios'
import { baseUrl } from '../axiosConfig'

function Profile() {
	const { user } = useUser()

  const [username, setUsername] = useState(user.username)
  // const [usernameDisabled, setUsernameDisabled] = useState(true)

  const [open, setOpen] = useState(false)

	return (
		<Paper square sx={{ 
			display: "flex", 
			flexDirection: "column", 
			width: "100vw", 
			height: "100vh", 
			padding: '2vh 5vw' 
		}}>
			<Navbar />
      <ChangeAvatarModal open={open} setOpen={setOpen}/>

      <Typography fontWeight="100" variant="h4">Profile</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3}}>
        <Box sx={{
          display: 'flex',
          gap: 2
        }}>
          <MuiAvatar sx={{ border: 2, borderColor: 'primary.dark', backgroundColor: 'inherit', width: 200, height: 200, alignSelf: 'center'}}>
            <UserAvatar user={user}/>
          </MuiAvatar>
          <Button sx={{ alignSelf: 'center' }} variant="outlined" color="warning" onClick={() => setOpen(true)}>Change</Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 2}}>
          <TextField value={username} disabled label="Username"></TextField>
          <Button sx={{ alignSelf: 'center'}} variant="outlined" disabled>Change</Button>
        </Box>
      </Box>
		</Paper>
	)
}

export default Profile;