import React, { useState } from 'react'

import { Box, Paper, Typography, Button, Modal, Grow, Fab } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { grey } from '@mui/material/colors'

import AddParticipantModal from './AddParticipantModal'

import { useChat } from '../contexts/chatContext'
import { useUser } from '../contexts/userContext'
import { useUsers } from '../contexts/usersContext'
import { useSocket } from '../contexts/socketContext'

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

  const leaveConversation = () => {
    socket.socketRef.current.emit('leave-conversation', {
      conversationID: currentConversation._id
    })
  }

  const inConversation = (currentConversation.participants.find(p => p._id === user._id))

  return (
    <Box sx={{ flexGrow: 2}}>
      <AddParticipantModal open={open} setOpen={setOpen} />
      
      <Paper square elevation={3} sx={{ 
        textAlign: 'center', 
        p: 1
      }}>
        <Typography variant="h5">Conversation Info</Typography>
      </Paper>
      { currentConversation.isDM ? 
        <Box> 
          {/* <Typography variant="h6">DM info</Typography> */}
          <Typography variant="body1">(No content yet)</Typography>
        </Box>
          : 
        <Box>
            <Typography variant="h6">(No content yet)</Typography>
            { inConversation && <Button onClick={leaveConversation}>Leave</Button>}
            <Box sx={{ mt: 1}}>
              <Typography display="inline-block" variant="h6">Participants</Typography>
              {isCurrentUserAdmin() && <Fab onClick={addParticipant} sx={{}} color="primary" size="small"><AddIcon /></Fab>}
            </Box>
            {currentConversation.participants.map(participant => {
              return (
                <Box key={participant._id}>
                  <Typography variant="body1">{ participant.username }
                  {participant.isAdmin ? '(Admin)' : ''}
                  </Typography>
                  {isCurrentUserAdmin() && isNotSelf(participant) && <Button onClick={() => removeParticipant(participant)}>Remove</Button>}
                  {isCurrentUserAdmin() && isNotSelf(participant) && !participant.isAdmin && <Button onClick={() => promoteToAdmin(participant)}>Promote</Button>}
                </Box>
              )
            })}
        </Box>}
    </Box>
  )
}
