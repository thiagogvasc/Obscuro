import React, { useState, useEffect } from 'react'
import { IconButton, Fab, Popper, Box, Fade } from '@mui/material'
import ThumbUp from '@mui/icons-material/ThumbUpAlt'
import ThumbUpOutlined from '@mui/icons-material/ThumbUpAltOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { grey } from '@mui/material/colors';

import { useInfoSidebar } from '../contexts/infoSidebarContext';
import { useUser } from '../contexts/userContext';
import { useChat } from '../contexts/chatContext';
import { useSocket } from '../contexts/socketContext';


export default function MessagePopover({open, anchorEl, message}) {

  const socket = useSocket()
  const { userID } = useUser()
  const { setChatData, currentConversation } = useChat()
  const { setOpenConversationInfo, setOpenMessageInfo, setCurrentMessage } = useInfoSidebar()


  const handleOpenInfo = () => {
    setCurrentMessage(message)
    setOpenConversationInfo(false)
    setOpenMessageInfo(true)
  }

  const handleLikeMessage = () => {
    const alreadyLiked = (message.likes.some(like => like.by === userID))
    if (alreadyLiked) return

    socket.socketRef.current.emit('like-message', {
      conversationID: currentConversation._id,
      messageID: message._id,
      by: userID,
      at: new Date()
    })
  }

  const messageFromSelf = (message.sender._id === userID)
  const likedByClient = (message.likes.some(like => like.by === userID))

  return (
    <Popper open={open} anchorEl={anchorEl} placement="bottom-start">
      <Fade in>
        <Box sx={{ m: 1, borderRadius: '10px',backgroundColor: grey[800]}}>
          {!messageFromSelf && 
            <IconButton onClick={handleLikeMessage} color="success">
              {likedByClient ? <ThumbUp /> : <ThumbUpOutlined /> }
            </IconButton>
          }
          <IconButton onClick={handleOpenInfo} color="info"><MoreVertIcon /></IconButton>
        </Box>
      </Fade>
    </Popper>
  )
}
