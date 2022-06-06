import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

import { useUser } from '../contexts/userContext'
import { useSocket } from '../contexts/socketContext'
import { generateColor } from '../util/generateColor'


function Login() {
    console.log('rendered login')

    const user = useUser()
    const socket = useSocket()
    const navigate = useNavigate()
    const [username, setUsername] = useState('')

    useEffect(() => {
        const persistedUser = JSON.parse(sessionStorage.getItem('user'))
        console.log(persistedUser)
    
        if (persistedUser) {
            socket.initConnection()
            socket.onAuthorized(() => navigate('/chat'))
        }
    }, [])

    const handleChange = (e) => {
        setUsername(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        socket.initConnection()
        const color = generateColor()
        socket.emitLogin({ username, color })
        socket.onLoginSuccess((newUser) => {
            const newUser1 = {...newUser, isLoggedIn: true}
            console.log(newUser1)
            user.setUser(newUser1)
            sessionStorage.setItem('user', JSON.stringify(newUser1))
            navigate('/chat')
        })

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
        {socket.connected ? <div>connected</div> : <div>not connected</div>}
        {socket.connectError ? <div>{socket.connectError.message}</div> : <div>no error: {socket.connectError}</div>}
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
                    <TextField onChange={handleChange} value={username} autoComplete="off" name="username"></TextField>
                    <Button sx={{ display: "block" }} type="submit" variant="contained">Enter chat</Button>
                </Box>
            </form>
        </Box>
    )
}

export default Login;