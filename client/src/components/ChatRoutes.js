import React from 'react'
import { ChatProvider } from '../contexts/chatContext'
import ProtectedRoute from './ProtectedRoute'
import { UsersProvider } from '../contexts/usersContext'
import { Outlet } from 'react-router-dom'


export default function ChatRoutes() {
  return (
    <ProtectedRoute>
      <UsersProvider>
        <ChatProvider>
          <Outlet />
        </ChatProvider>
      </UsersProvider>
    </ProtectedRoute>
  )
}
