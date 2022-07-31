import React, { useState } from 'react'

import { Box, Paper, Typography, Button, Modal, Grow, Fab } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { grey } from '@mui/material/colors'

import AddParticipantModal from './AddParticipantModal'

import { useChat } from '../contexts/chatContext'
import { useUser } from '../contexts/userContext'
import { useUsers } from '../contexts/usersContext'

export default function ConversationInfo() {
  const { currentConversation } = useChat()
  const { userID } = useUser()
  const [open, setOpen] = useState(false)

  const addParticipant = e => {
    setOpen(true)
  }

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
                </Box>
              )
            })}
        </Box>}
    </Box>
  )
}
