import React, { useEffect } from 'react'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

import { useUser } from '../contexts/userContext'
import { generateColor } from '../util/generateColor'


function Login() {
    const user = useUser()


    const handleSubmit = (e) => {
        e.preventDefault()

        const name = e.target.username.value
        if (name !== '') user.login(name, generateColor())

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