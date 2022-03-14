import React from 'react'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Chat from './components/Chat'
import Login from './components/Login'

import { UserProvider } from './contexts/userContext'
import { SocketProvider } from './contexts/socketContext'

import './App.css'


function App() {
 
  return (
    <BrowserRouter>
      <SocketProvider>
        <UserProvider>
          <Container sx={{ width: "100vw", height: "100vh" }}>
            <Typography sx={{ padding: "5vh 5vw" }} variant="h2" align="center">Obscuro</Typography>
            <Routes>
              <Route path="/" element={ <Login /> } />
              <Route path="/chat" element={ <Chat /> } />
            </Routes>
          </Container>
        </UserProvider>
      </SocketProvider>
    </BrowserRouter>
  );
}

export default App;
