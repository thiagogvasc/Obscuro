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


function CreateConversation() {
  console.log('CreateConversation')
  const { userID } = useUser()
  const [formData, setFormData] = useState({
    name: '',
    isPublic: 'public',
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
      participants: [userID]
    }

    console.log(dataToSubmit)

    socket.emitCreateConversation(dataToSubmit)
  }
  return (
    <Box sx={{ color: 'white' }}>
      <Button onClick={() => {navigate('/chat')}}>Back</Button>
      <form onSubmit={ handleSubmit }>
        <Box>
          <Typography variant="body2">Name:</Typography>
          <TextField 
            onChange={handleChange} 
            value={formData.name} 
            autoComplete="off" 
            name="name"
            InputProps={{
              sx: {
                color: 'white',
                backgroundColor: grey[800],
                borderRadius: '25px'
              }
            }}
          />
          <FormControl sx={{display: 'block'}}>
            <FormLabel sx={{ color: 'white'}} id="demo-radio-buttons-group-label">Type</FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="public"
              name="isPublic"
              onChange={handleChange}
            >
              <FormControlLabel value="public" control={<Radio />} label="Public" />
              <FormControlLabel value="private" control={<Radio />} label="Private" />
            </RadioGroup>
          </FormControl>
        </Box>
          <Button variant="outlined">Cancel</Button>
          <Button type="submit" variant="contained">Create</Button>
      </form>
    </Box>
  )
}

export default CreateConversation;