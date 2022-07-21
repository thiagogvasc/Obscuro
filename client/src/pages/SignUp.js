import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'

import axios from 'axios'
import { grey } from '@mui/material/colors'
import Grow from '@mui/material/Grow';
import { TransitionGroup } from 'react-transition-group';


function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
		repeatPassword: ''
  })
  const [message, setMessage] = useState(null)
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
    const dataToSubmit = {
      username: formData.username,
			password: formData.password
    }

    if (dataToSubmit.password !== formData.repeatPassword) {
      setMessage({
        type: 'error',
        text: 'Passwords do not match'
      })
      return
    }

    console.log(dataToSubmit)
		axios.post('http://localhost:8080/auth/signup', dataToSubmit, { withCredentials: true }).then(result => {
			console.log(result.data)
      setMessage({
        type: 'success',
        text: result.data.message
      })
		}).catch(err => {
      setMessage({
        type: 'error',
        text: err.response.data
      })
    })
  }
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'column',
    }}>
      <Typography sx={{mb: 5}} variant="h3" fontWeight="100">Sign Up</Typography>
      { message && <Grow in><Alert sx={{m: 2}} variant="filled" severity={message.type}> { message.text } </Alert></Grow>}
      <form onSubmit={ handleSubmit }>
        <Box 
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "2vh"
          }}
        >
          <TextField 
            onChange={handleChange} 
            value={formData.username} 
            autoComplete="off" 
            name="username"
            label="Username"
            InputProps={{ sx: { borderRadius: '25px' }}}
          />
          <TextField 
            onChange={handleChange} 
            value={formData.password} 
            autoComplete="off" 
            name="password"
            type="password"
            label="Password"
            InputProps={{ sx: { borderRadius: '25px' }}}
          />
          <TextField 
            onChange={handleChange} 
            value={formData.repeatPassword} 
            autoComplete="off" 
            type="password"
            name="repeatPassword"
            label="Repeat password"
            InputProps={{ sx: { borderRadius: '25px' }}}
          />
          <Button sx={{mt: 2, width: '100%', borderRadius: '25px'}} type="submit" variant="contained">Submit</Button>
          <Button sx={{width: '100%', borderRadius: '25px'}} variant="outlined" onClick={() => navigate('/')}>Cancel</Button>
        </Box>
      </form>
    </Box>
  )
}

export default SignUp;