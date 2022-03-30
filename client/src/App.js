import React from 'react'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Chat from './components/Chat'
import Login from './components/Login'
import ProtectedRoute from './components/ProtectedRoute'

import { useUser, UserProvider } from './contexts/userContext'
import { SocketProvider } from './contexts/socketContext'

import './App.css'


function App() { 

  const { logout } = useUser()

  return (
    <BrowserRouter>
      <SocketProvider>
        <UserProvider>
          <Container sx={{ display: "flex", flexDirection: "column", width: "100vw", height: "100vh" }}>
            <Typography sx={{ padding: "5vh 5vw"}} variant="h2" align="center">Chat App</Typography>
            <Routes>
              <Route path="/" element={ <Login /> } />
              <Route path="/chat" element={ <ProtectedRoute> <Chat /> </ProtectedRoute> } />
            </Routes>
          </Container>
        </UserProvider>
      </SocketProvider>
    </BrowserRouter>
  );
}

export default App;
