import React from 'react'
import { ChatProvider } from '../contexts/chatContext'
import ProtectedRoute from './ProtectedRoute'
import { UsersProvider } from '../contexts/usersContext'
import { Outlet } from 'react-router-dom'
import { SidebarProvider } from '../contexts/sidebarContext'
import { InfoSidebarProvider } from '../contexts/infoSidebarContext'


export default function ChatRoutes() {
  return (
    <ProtectedRoute>
      <UsersProvider>
        <ChatProvider>
          <SidebarProvider>
            <InfoSidebarProvider>
              <Outlet />
            </InfoSidebarProvider>
          </SidebarProvider>
        </ChatProvider>
      </UsersProvider>
    </ProtectedRoute>
  )
}
