import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { useUser } from '../contexts/userContext'
import axios from 'axios'
import { Alert, Paper } from '@mui/material'


function Login() {
	const navigate = useNavigate()
	const { setUserID } = useUser()
	const [formData, setFormData] = useState({
		username: '',
		password: ''
	})

	const [message, setMessage] = useState(null)

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
				console.log(result.data.message)
				setMessage({
					type: 'success',
					text: result.data.message
				})
				setUserID(result.data.userid)
				navigate('/chat')
		}).catch(err => {
			setMessage({
				type: 'error',
				text: err.response.data
			})
			console.log(err.response.data)
		})
	}
	console.log(message)
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
						gap: "2vh"
					}}
				>
					<Typography fontWeight="100" sx={{mb: 5}} variant="h3">Login</Typography>
					{ message && <Alert sx={{m: 2}} variant="filled" severity={message.type}> { message.text } </Alert> }
					<TextField 
						onChange={handleChange} 
						value={formData.username} 
						autoComplete="off" 
						name="username"
						label="Username"
						variant="outlined"
						InputProps={{ sx: { borderRadius: '25px' }}}
					/>
					{/* <Typography variant="body2">Password:</Typography> */}
					<TextField
						onChange={handleChange} 
						value={formData.password} 
						autoComplete="off" 
						name="password"
						label="Password"
						type="password"
						variant="outlined"
						InputProps={{ sx: { borderRadius: '25px' }}}
					/>
					<Button sx={{ width: '100%', borderRadius: '25px', mt: 2, display: "block" }} type="submit" variant="contained">Enter chat</Button>
					<Button sx={{ width: '100%', borderRadius: '25px'}} variant="outlined" onClick={() => {navigate('/signup')}}>Sign up</Button>
				</Box>
			</form>
		</Box>
	)
}

export default Login;