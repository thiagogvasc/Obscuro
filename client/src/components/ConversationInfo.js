import React, { useState } from 'react'

import { Box, Paper, Typography, Button, Modal, Grow, Fab } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { grey } from '@mui/material/colors'

import AddParticipantModal from './AddParticipantModal'

import { useChat } from '../contexts/chatContext'
import { useUsers } from '../contexts/usersContext'

export default function ConversationInfo() {
  const { currentConversation } = useChat()
  const [open, setOpen] = useState(false)

  const addParticipant = e => {
    setOpen(true)
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
          <Typography variant="h6">DM info</Typography>
          <Typography variant="body1">(No content yet)</Typography>
        </Box>
          : 
        <Box>
            <Typography variant="h6">(Group description)</Typography>
            <Box textAlign="center">
              <Typography display="inline-block" variant="h6">Participants</Typography>
              <Fab onClick={addParticipant} sx={{}} color="primary" size="small"><AddIcon /></Fab>
            </Box>
            {currentConversation.participants.map(participant => {
              return (
                <Box key={participant._id}>
                  <Typography>

                   {participant.username}
                  </Typography>
                </Box>
              )
            })}
        </Box>}
    </Box>
  )
}
