import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

import axios from 'axios'
import { grey } from '@mui/material/colors'


function SignUp() {
  console.log('SignUp')
  const [formData, setFormData] = useState({
    username: '',
    password: '',
		repeatPassword: ''
  })
  const navigate = useNavigate()

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
      username: formData.username,
			password: formData.password
    }

    console.log(dataToSubmit)
		axios.post('http://localhost:8080/auth/signup', dataToSubmit, { withCredentials: true }).then(result => {
			console.log(result.data)
		})
  }
  return (
    <Box sx={{ color: 'white' }}>
      <Button onClick={() => {navigate('/')}}>Back</Button>
      <form onSubmit={ handleSubmit }>
        <Box>
          <Typography variant="body2">Username:</Typography>
          <TextField 
            onChange={handleChange} 
            value={formData.username} 
            autoComplete="off" 
            name="username"
            InputProps={{
              sx: {
                color: 'white',
                backgroundColor: grey[800],
                borderRadius: '25px'
              }
            }}
          />
					<Typography variant="body2">Password:</Typography>
          <TextField 
            onChange={handleChange} 
            value={formData.password} 
            autoComplete="off" 
            name="password"
            InputProps={{
              sx: {
                color: 'white',
                backgroundColor: grey[800],
                borderRadius: '25px'
              }
            }}
          />
					<Typography variant="body2">Repeat password:</Typography>
          <TextField 
            onChange={handleChange} 
            value={formData.repeatPassword} 
            autoComplete="off" 
            name="repeatPassword"
            InputProps={{
              sx: {
                color: 'white',
                backgroundColor: grey[800],
                borderRadius: '25px'
              }
            }}
          />
        </Box>
          <Button variant="outlined">Cancel</Button>
          <Button type="submit" variant="contained">Create</Button>
      </form>
    </Box>
  )
}

export default SignUp;