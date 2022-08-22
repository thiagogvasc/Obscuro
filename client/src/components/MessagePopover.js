import React, { useState, useEffect } from 'react'
import { IconButton, Fab, Popper, Box, Fade } from '@mui/material'
import ThumbUp from '@mui/icons-material/ThumbUpAlt'
import ThumbUpOutlined from '@mui/icons-material/ThumbUpAltOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { grey } from '@mui/material/colors';

import { useInfoSidebar } from '../contexts/infoSidebarContext';


export default function MessagePopover({open, anchorEl, message}) {

  const { 
    setOpenConversationInfo, 
    setOpenMessageInfo, 
    setCurrentMessage
  } = useInfoSidebar()

  const handleOpenInfo = () => {
    setCurrentMessage(message)
    setOpenConversationInfo(false)
    setOpenMessageInfo(true)
  }

  return (
    <Popper open={open} anchorEl={anchorEl} placement="bottom-start">
      <Fade in>
        <Box sx={{ m: 1, borderRadius: '10px',backgroundColor: grey[800]}}>
          {/* <IconButton color="success"><ThumbUpOutlined /></IconButton> */}
          <IconButton onClick={handleOpenInfo} color="info"><MoreVertIcon /></IconButton>
        </Box>
      </Fade>
    </Popper>
  )
}
