import React, { useState, useRef } from 'react'

import Paper from '@mui/material/Paper'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Box from '@mui/material/Box'
import Slide from '@mui/material/Slide'
import SidebarConversations from './SidebarConversations'
import SidebarUsers from './SidebarUsers'

import { useSidebar } from '../contexts/sidebarContext'

export default function Sidebar({ shouldOpenSidebar, setShouldOpenSidebar }) {
  const { tab, setTab } = useSidebar()
  const containerRef = useRef(null)

  const handleTabChange = (e, newValue) => {
    setTab(newValue)
  }


  return (
    <Paper ref={containerRef} elevation={2} sx={{ 
      display: 'flex',
      flexDirection: 'column',
      display: {
        xs: shouldOpenSidebar ? "flex":"none", 
        sm: "flex"
      }, 
      width: shouldOpenSidebar ? '100%' : '25%', 
      borderRadius: '25px',
      minWidth: '250px',
      overflow: 'hidden'
    }}>

      <Paper elevation={3} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs variant="fullWidth" value={tab} onChange={handleTabChange}>
          <Tab label="Conversations" value="conversations" />
          <Tab label="Users" value="users" />
        </Tabs>
      </Paper>

      <Box sx={{ flexGrow: 1, position: 'relative' }}>
          <Slide in={tab === 'conversations'} direction="right" container={containerRef.current}>
            <SidebarConversations shouldOpenSidebar={shouldOpenSidebar} setShouldOpenSidebar={setShouldOpenSidebar}/>
          </Slide>
          <Slide in={tab === 'users'} direction="left" container={containerRef.current}>
            <SidebarUsers shouldOpenSidebar={shouldOpenSidebar} setShouldOpenSidebar={setShouldOpenSidebar}/>
          </Slide>
      </Box>
    </Paper>
  )
}
