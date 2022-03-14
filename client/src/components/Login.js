import React, { useEffect } from 'react'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

import { userContext } from '../contexts/userContext'
import { socketContext } from '../contexts/socketContext'

import { io } from 'socket.io-client'


function Login() {

    const { userInfo, setUserInfo } = useContext(userContext)
    const { socket, setSocket } = useContext(socketContext)
    console.log(socket)

    const navigate = useNavigate()

    const generateColor = () => {
        const hexValues = '456789ABC'
        let color = ''
        color += '#'
        for (let i = 0; i < 6; i++) {
            const value = Math.floor(Math.random() * 9)
            color += hexValues[value]
        }

        return color
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const name = e.target.username.value

        if (name) {
            initiateConnection(name)
        }

        e.target.username.focus()
        e.target.reset()
    }

    const initiateConnection = (name) => {
        const color = generateColor()
        console.log(color)
        setUserInfo({
            username: name,
            color: color
        })
        setSocket(io(), { 
            userInfo: userInfo
        })
    }

    useEffect(() => {
        if (socket) {
            socket.on('connect', () => {
                console.log('connected')
                navigate('/chat')
            })
        }
    }, [socket])

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
