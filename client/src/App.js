import React from 'react'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Navbar from './components/Navbar'
import Chat from './pages/Chat'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { UserProvider } from './contexts/userContext'
import { SocketProvider } from './contexts/socketContext'
import { ChatProvider } from './contexts/chatContext'

import './App.css'
import { grey, purple, blue, red } from '@mui/material/colors/'
import CreateConversation from './pages/CreateConversation'
import SignUp from './pages/SignUp'
import { UsersProvider } from './contexts/usersContext'
import { Paper } from '@mui/material'
import ChatRoutes from './components/ChatRoutes'
import axios from 'axios'
if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL ='http://localhost:8080'
}
import {baseUrl} from './axiosConfig'
import Profile from './pages/Profile'

function App() { 
  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: purple[700]
      },
    }
  })
  return (
    <BrowserRouter>
      <SocketProvider>
        <UserProvider>
            <ThemeProvider theme={theme}>
              
                <Routes>
                  <Route path="/" element={ <Login /> } />
                  <Route path="/signup" element={ <SignUp /> } />
                  <Route path="/chat" element={ <ChatRoutes /> }>
                    <Route index element={ <Chat /> } />
                    <Route path='create-conversation' element={ <CreateConversation /> } />
                    <Route path='profile' element={ <Profile /> } />
                  </Route>
                </Routes>
              
            </ThemeProvider>
        </UserProvider>
      </SocketProvider>
    </BrowserRouter>
  );
}

export default App;
