import React from 'react'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Navbar from './components/Navbar'
import Chat from './components/Chat'
import Login from './components/Login'
import ProtectedRoute from './components/ProtectedRoute'

import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

import { useUser, UserProvider } from './contexts/userContext'
import { SocketProvider } from './contexts/socketContext'
import { MessagesProvider } from './contexts/messagesContext'

import './App.css'
import { Button } from '@mui/material'
import { grey } from '@mui/material/colors/'

function App() { 
  const theme = createTheme({
  
  })
  return (
    <BrowserRouter>
      <SocketProvider>
        <UserProvider>
          <ThemeProvider theme={theme}>
            <Box sx={{ 
              display: "flex", 
              flexDirection: "column", 
              width: "100vw", 
              height: "100vh", 
              backgroundColor: grey[900],
              padding: '2vh 5vw' 
            }}>
              <Navbar />
              <Routes>
                <Route path="/" element={ <Login /> } />
                <Route path="/chat" element={ <ProtectedRoute> <MessagesProvider> <Chat /> </MessagesProvider></ProtectedRoute> } />
              </Routes>
            </Box>
          </ThemeProvider>
        </UserProvider>
      </SocketProvider>
    </BrowserRouter>
  );
}

export default App;
