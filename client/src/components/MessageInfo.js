import React, { useEffect, useState } from 'react'

import { Box, Paper, Typography, Button, Modal, Grow, Fab, List, ListItem, ListItemText, IconButton, ListItemSecondaryAction, ListItemAvatar, Avatar, ListSubheader, Divider } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { grey } from '@mui/material/colors'

import PersonRemoveIcon from '@mui/icons-material/PersonRemove'
import UpgradeIcon from '@mui/icons-material/Upgrade';

import AddParticipantModal from './AddParticipantModal'

import { useChat } from '../contexts/chatContext'
import { useUser } from '../contexts/userContext'
import { useUsers } from '../contexts/usersContext'
import { useSocket } from '../contexts/socketContext'
import UserAvatar from './UserAvatar'
import MuiAvatar from '@mui/material/Avatar'

export default function MessageInfo({message}) {
  const { currentConversation } = useChat()
  const { userID, user } = useUser()
  const [open, setOpen] = useState(false)
  const socket = useSocket()

  const dateConfig = { hour: 'numeric', minute: 'numeric', hour12: true, second: '2-digit', fractionalSecondDigits: 3}
  const renderDate = date => {
    return new Date(date).toLocaleString('en-US', dateConfig)
  }

  const findParticipant = id => {
    return currentConversation.participants.find(p => p._id === id)
  }

  const findParticipantsThatReadMessage = () => {
    const participantsIDs = message.read.map(r => r.by)
    console.log(participantsIDs)
    return participantsIDs.map(id => findParticipant(id))
  }
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: '250px'}}>
      <Paper square elevation={3} sx={{ 
        textAlign: 'center', 
        p: 1,
        borderTopRightRadius: '25px',
      }}>
        <Typography>Message Info</Typography>
      </Paper>
      
      <Box sx={{
        m: 2,
        borderRadius: '10px',
        backgroundColor: 'primary.main',
        alignSelf: 'center'
      }}>
        <Typography sx={{ p: 1, color: 'primary.contrastText', maxWidth: '200px', wordWrap: 'break-word', textAlign: 'left'}}>{message.text}</Typography>
      </Box>
      
      <Typography sx={{ pl: 2}} variant="h6">Sent</Typography>
      <Divider variant="middle"/>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, px: 2, color: 'text.secondary'}}>
        <Typography>{message.sender.username}</Typography>
        <Typography>{renderDate(message.sentAt)}</Typography>
      </Box>
      
      <Typography sx={{ pl: 2}} variant="h6">Delivered</Typography>
      <Divider variant="middle"/>
      <Typography sx={{ py: 1, px: 2, color: 'text.secondary'}}>{renderDate(message.deliveries[0].at)}</Typography>
     
      <Typography sx={{ pl: 2}} variant="h6">Read</Typography>
      <Divider variant="middle"/>
      {findParticipantsThatReadMessage().map(participant => (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, px: 2, color: 'text.secondary'}}>
          <Typography>{participant.username}</Typography>
          <Typography>{renderDate(message.read.find(r => r.by === participant._id).at)}</Typography>
        </Box>
      ))}
    </Box>
  )
}
