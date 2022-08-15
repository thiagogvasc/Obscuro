import React from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import { Typography, Badge, IconButton } from '@mui/material'
import Avatar from 'avataaars'

import { generateRandomAvatarOptions } from '../avatars'
import { grey } from '@mui/material/colors'
import { useChat } from '../contexts/chatContext'
import { useUser } from '../contexts/userContext'
import { useSocket } from '../contexts/socketContext'
import UserAvatar from './UserAvatar'
import ConversationAvatar from './ConversationAvatar'

import { ListItem, ListItemAvatar, ListItemText, ListItemSecondaryAction } from '@mui/material'
import MuiAvatar from '@mui/material/Avatar'

export default function SidebarChat({ conversation, shouldOpenSidebar, setShouldOpenSidebar}) {
  const { currentConversation, setCurrentConversation, chatData} = useChat()
  const { userID, user} = useUser()
  const shouldHighlight = conversation._id === currentConversation._id

  const getNumberOfUnreadMessages = () => {
    let count = 0
    conversation.messages.forEach(message => {
      if (message.conversation._id === currentConversation._id) return
      //if (!message.read.by.includes(userID)) count++
      if (message.read.filter(read => read.by === userID).length === 0) count++
    })
    return count
  }

  const numberOfUnreadMessages = getNumberOfUnreadMessages()

  const select = () => {
    setCurrentConversation(conversation)
    setShouldOpenSidebar(false)
  }

  const getLastMessage = () => {
    const messages = conversation.messages
    if (messages.length <= 0) return null

    const lastMessage = messages[messages.length - 1]
    return lastMessage
  }
  const message = getLastMessage()

  return (
    // mayve just pass the whole receiver
    <ListItem square elevation={1} onClick={select} sx={{
      transition: 'background-color .2s',
      backgroundColor: shouldHighlight && 'action.selected',
      '&:hover': {
        backgroundColor: 'action.hover',
        cursor: 'pointer'
      }
    }}>
      <ListItemAvatar>
        <MuiAvatar sx={{ border: 2, borderColor: 'primary.light', backgroundColor: 'inherit'}}>
          {conversation.isDM ? <UserAvatar user={conversation.participants.find(u => u._id !== userID)} /> : <ConversationAvatar />}
        </MuiAvatar>
      </ListItemAvatar>

      <ListItemText 
        primary={conversation.name} 
        secondary={message && (message.isInfo ? message.text : message.sender.username + ': ' + message.text)} 
        secondaryTypographyProps={{ 
          sx: { 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap', 
            fontWeight: numberOfUnreadMessages > 0 ? 'bold' : 'regular' 
          }
        }}
      />
      <IconButton edge="end">{numberOfUnreadMessages ? <Badge color="primary" showZero={false} badgeContent={numberOfUnreadMessages} /> : null }</IconButton>
    </ListItem>
  )
}
