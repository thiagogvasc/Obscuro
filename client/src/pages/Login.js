import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import MyTextField from '../components/MyTextField'
import Button from '@mui/material/Button'

import axios from 'axios'


function Login() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })

    useEffect(() => {
        // fetch session data
    }, [])

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
        e.target.username.focus()

        setFormData({
            username: '',
            password: ''
        })

        axios.post('http://localhost:8080/auth/login', formData, { withCredentials: true }).then(result => {
            console.log(result.data)
            if (result.statusText === 'OK') {
                console.log('success logging in')
                navigate('/chat')
            }
        })
    }

    return (
        <Box 
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                color: "white"
            }}
        >   
            <form onSubmit={ handleSubmit }>
                <Box 
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "1vh"
                    }}
                >
                    <Typography variant="body2">Username:</Typography>
                    <MyTextField 
                        onChange={handleChange} 
                        value={formData.username} 
                        autoComplete="off" 
                        name="username"
                        InputProps={{
                            sx: {
                              color: 'black',
                              backgroundColor: 'white',
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
                              color: 'black',
                              backgroundColor: 'white',
                              borderRadius: '25px'
                            }
                        }}
                    />
                    <Button sx={{ display: "block" }} type="submit" variant="contained">Enter chat</Button>
                </Box>
            </form>
        </Box>
    )
}

export default Login;