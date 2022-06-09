import React from 'react'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Navbar from './components/Navbar'
import Chat from './components/Chat'
import Login from './components/Login'
import ProtectedRoute from './components/ProtectedRoute'

import { useUser, UserProvider } from './contexts/userContext'
import { SocketProvider } from './contexts/socketContext'

import './App.css'
import { Button } from '@mui/material'


function App() { 
  return (
    <BrowserRouter>
      <SocketProvider>
        <UserProvider>
          <Box sx={{ display: "flex", flexDirection: "column", width: "100vw", height: "100vh", backgroundColor: '#2D2D30', padding: '2vh 5vw' }}>
            <Navbar />
            <Routes>
              <Route path="/" element={ <Login /> } />
              <Route path="/chat" element={ <ProtectedRoute> <Chat /> </ProtectedRoute> } />
            </Routes>
          </Box>
        </UserProvider>
      </SocketProvider>
    </BrowserRouter>
  );
}

export default App;
