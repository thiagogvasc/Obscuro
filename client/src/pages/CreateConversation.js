import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import axios from 'axios'
import { grey } from '@mui/material/colors'
import { useSocket } from '../contexts/socketContext'
import { useUser } from '../contexts/userContext'
import { useUsers } from '../contexts/usersContext'
import SidebarUser from '../components/SidebarUser'
import { Chip, Paper, Fab } from '@mui/material'

import AddIcon from '@mui/icons-material/Add'



function CreateConversation() {
  console.log('CreateConversation')
  const { userID } = useUser()
  const { users } = useUsers()
  const [formData, setFormData] = useState({
    name: '',
    isPublic: 'public',
    participants: []
  })
  const navigate = useNavigate()
  const socket = useSocket()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })

    console.log(formData)
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    // reevalutate public and private to true and false
    const dataToSubmit = {
      ...formData,
      isDM: false,
      isPublic: formData.isPublic === 'public' ? true : false,
      participants: [userID, ...formData.participants.map(participant => participant._id)]
    }

    console.log(dataToSubmit)

    socket.emitCreateConversation(dataToSubmit)
  }

  const addParticipant = user => {
    // exits if already added
    if (formData.participants.find(participant => participant._id === user._id))
      return

    // if not already added
    setFormData({
      ...formData,
      participants: [...formData.participants, user]
    })
  }

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
     }}>
      <Typography fontWeight="100" sx={{mb: 5}} variant="h3">Create Conversation</Typography>
      <form onSubmit={ handleSubmit }>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '2vh'
        }}>
          <TextField 
            onChange={handleChange} 
            value={formData.name} 
            autoComplete="off" 
            name="name"
            label="Name"
            InputProps={{ sx: { borderRadius: '25px' }}}
          />
          <FormControl sx={{display: 'block'}}>
            <FormLabel sx={{ color: 'white'}}>Type</FormLabel>
            <RadioGroup
              defaultValue="public"
              name="isPublic"
              onChange={handleChange}
              row
            >
              <FormControlLabel value="public" control={<Radio />} label="Public" />
              <FormControlLabel value="private" control={<Radio />} label="Private" />
            </RadioGroup>
          </FormControl>
          <Typography variant="body1">Participants</Typography>
          {formData.participants.map(participant => (
            <Chip label={participant.username} />
          ))}
          <Paper sx={{ p:2, borderRadius: '25px', width: '100%'}} elevation={2}>
            <Typography variant="h5">Participants</Typography>
            {users.map(user => (
              <Box>
                {user.username}
                <Fab sx={{ml: 2}} color="primary" size="small" onClick={() => addParticipant(user)}variant="outlined"><AddIcon /></Fab>
              </Box>
            ))}  
          </Paper>
          <Button sx={{ width: '100%', borderRadius: '25px', mt: 2, display: "block" }} type="submit" variant="contained">Create</Button>
					<Button sx={{ width: '100%', borderRadius: '25px'}} variant="outlined" onClick={() => {navigate('/chat')}}>Cancel</Button>
        </Box>
      </form>
    </Box>
  )
}

export default CreateConversation;