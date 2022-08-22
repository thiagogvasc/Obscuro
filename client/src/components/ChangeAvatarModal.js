import React, { useState } from 'react'

import { Box, Paper, Typography, Button, Checkbox, Modal, Chip, Grow, Zoom, Select, MenuItem } from '@mui/material'
import { grey } from '@mui/material/colors'
import CloseIcon from '@mui/icons-material/Close'

import { useChat } from '../contexts/chatContext'
import { useUser } from '../contexts/userContext'
import { useSocket } from '../contexts/socketContext'

import MuiAvatar from '@mui/material/Avatar'
import UserAvatar from './UserAvatar'
import Avatar from 'avataaars'
import { configs } from '../avatars'
import axios from 'axios'
import { baseUrl } from '../axiosConfig'

export default function ChangeAvatarModal({open, setOpen}) {
  const { user, setUser } = useUser()
  const [avatarOptions, setAvatarOptions] = useState(JSON.parse(user.avatarOptions))


  const handleClose = () => {
    setOpen(false)
  }


  const handleSubmit = () => {
    // POST request
    axios.put(`${baseUrl}/user/${user._id}/avatar`, {avatarOptions: JSON.stringify(avatarOptions)}, { withCredentials: true }).then(res=> {
      setUser(prevUser => {
        return {
          ...prevUser,
          avatarOptions: res.data.avatarOptions
        }
      })
    }).catch(err => {
        console.log(err)
    })
  }

  const handleChange = (key, value) => {
    setAvatarOptions(prevAvatarOptions => {
      prevAvatarOptions[key] = value
      return { ...prevAvatarOptions }
    })
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Paper elevation={1} sx={{ 
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '75%',
        height: '75%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        color: 'white',
        overflowY: 'auto'
      }}>

        <Paper elevation={2} square sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1}}>
          <Typography variant="h5">Change Avatar</Typography>
          <Button onClick={handleClose}><CloseIcon fontSize="large" color="primary" /></Button>
        </Paper>

        <MuiAvatar sx={{ border: 2, borderColor: 'primary.dark', backgroundColor: 'inherit', width: 200, height: 200, alignSelf: 'center'}}>
            <Avatar {...avatarOptions}></Avatar>
        </MuiAvatar>
      
        {Object.entries(configs).map(entry => {
          const [key, items] = entry
          return (
            <Box sx={{ px: 2, pb: 1}}>
              <Typography variant="body1">{key}</Typography>
              <Select onChange={(e) => handleChange(key, e.target.value)} fullWidth value={avatarOptions[key]} MenuProps={{ PaperProps: {sx: { maxHeight: 300 }}}}>
                {items.map(item => <MenuItem value={item}>{item}</MenuItem> )}
              </Select>
            </Box>
          )
        })}
       
        <Box sx={{alignSelf: 'flex-end', p: 3}}>
          <Button size="large" variant="outlined" sx={{ mr: 2}} onClick={handleClose}>Cancel</Button>
          <Button size="large" variant="contained" onClick={handleSubmit}>Submit</Button>
        </Box>
      </Paper>
    </Modal>
  )
}
