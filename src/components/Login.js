import React from 'react'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

import { userContext } from '../contexts/userContext'



function Login() {

    const { setUserInfo } = useContext(userContext)

    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()

        const name = e.target.username.value

        if (name) {
            setUserInfo({ username: name })
            navigate('/chat')
        }

        e.target.username.focus()
        e.target.reset()
    }

    return (
            <Box 
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
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
                        <Typography variant="body2">Enter a name</Typography>
                        <TextField autoComplete="off" name="username"></TextField>
                        <Button sx={{ display: "block" }} type="submit" variant="contained">Enter chat</Button>
                    </Box>
                </form>
            </Box>
    )
}

export default Login;
