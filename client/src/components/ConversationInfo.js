import React, { useState } from 'react'

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

export default function ConversationInfo() {
  const { currentConversation } = useChat()
  const { userID, user } = useUser()
  const [open, setOpen] = useState(false)
  const socket = useSocket()

  const addParticipant = e => {
    setOpen(true)
  }

  const isNotSelf = (participant) => participant._id !== userID

  const isCurrentUserAdmin = () => {
    let isAdmin = false
    const userFound = currentConversation.participants.find(p => p._id === userID)
    if (userFound) {
      console.log(userFound)
      if (userFound.isAdmin) {
        isAdmin = true
      }
    }
    return isAdmin
  }

  const promoteToAdmin = participant => {
    socket.socketRef.current.emit('promote-participant', {
      conversationID: currentConversation._id,
      participantID: participant._id
    })
  }

  const removeParticipant = participant => {
    socket.socketRef.current.emit('remove-participant', {
      conversationID: currentConversation._id,
      participant
    })
  }
  
  const addParticipants = selectedUsers => {
    const participantsIDs = selectedUsers.map(u => u._id)
    socket.socketRef.current.emit('add-participants', {
      conversationID: currentConversation._id,
      // Filter only participants who were not already added to the conversation
      participantsIDs: participantsIDs.filter(id => !currentConversation.participants.map(p => p._id).includes(id))
    })
  }

  const leaveConversation = () => {
    socket.socketRef.current.emit('leave-conversation', {
      conversationID: currentConversation._id
    })
  }

  const inConversation = (currentConversation.participants.find(p => p._id === user._id))

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: '250px'}}>
      <AddParticipantModal open={open} setOpen={setOpen} onSubmit={addParticipants} />
      
      <Paper square elevation={3} sx={{ 
        textAlign: 'center', 
        p: 1,
        borderTopRightRadius: '25px',
      }}>
        <Typography>Conversation Info</Typography>
      </Paper>
      { currentConversation.isDM ? 
        <Box sx={{ p: 1, textAlign: 'center'}}> 
          {/* <Typography variant="h6">DM info</Typography> */}
          <Typography variant="body1">(No content yet)</Typography>
        </Box>
          : 
        <Box sx={{ flexGrow: 1, height: 0, overflowY: 'auto'}}>
            <Typography variant="h6">(No content yet)</Typography>
            { inConversation && currentConversation.name !== 'General' && <Button color="error" sx={{ color: 'error.light'}} onClick={leaveConversation}>Leave conversation</Button>}
             <Box sx={{ mt: 1, px: 1, display: 'flex', alignItems: 'center', gap: 1}}>
                <Typography display="inline-block" sx={{ color: 'text.secondary'}} variant="h6">Participants</Typography>
                {isCurrentUserAdmin() && <Fab onClick={addParticipant} sx={{}} color="primary" size="small"><AddIcon /></Fab>}
              </Box>
            <List>

              {currentConversation.participants.map(participant => {
                return (
                  <ListItem key={participant._id}>
                    <ListItemAvatar>
                      {/* <Avatar /> */}
                      <MuiAvatar sx={{ border: 2, borderColor: 'primary.light', backgroundColor: 'inherit'}}>
                        <UserAvatar user={participant} ></UserAvatar>
                      </MuiAvatar>
                    </ListItemAvatar>
                    <ListItemText primary={`${participant.username} ${participant.isAdmin ? '(Admin)' : ''}`} primaryTypographyProps={{ sx: { whiteSpace: "nowrap", textOverflow: 'ellipsis', overflow: 'hidden'}}}></ListItemText>
                    <ListItemSecondaryAction>
                        {isCurrentUserAdmin() && isNotSelf(participant) && <IconButton color="error" onClick={() => removeParticipant(participant)}><PersonRemoveIcon /></IconButton>}
                        {isCurrentUserAdmin() && isNotSelf(participant) && !participant.isAdmin && <IconButton color="success" onClick={() => promoteToAdmin(participant)}><UpgradeIcon /></IconButton>}
                    </ListItemSecondaryAction>
                  </ListItem>
                )
              })}
            </List>
        </Box>}
    </Box>
  )
}
