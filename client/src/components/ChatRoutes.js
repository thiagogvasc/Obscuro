import React from 'react'
import { ChatProvider } from '../contexts/chatContext'
import ProtectedRoute from './ProtectedRoute'
import { UsersProvider } from '../contexts/usersContext'
import { Outlet } from 'react-router-dom'
import { SidebarProvider } from '../contexts/sidebarContext'


export default function ChatRoutes() {
  return (
    <ProtectedRoute>
      <UsersProvider>
        <ChatProvider>
          <SidebarProvider>
            <Outlet />
          </SidebarProvider>
        </ChatProvider>
      </UsersProvider>
    </ProtectedRoute>
  )
}
