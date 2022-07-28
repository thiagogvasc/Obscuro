import React, { useState } from 'react'

import { Box, Paper, Typography, Button, Modal, Grow } from '@mui/material'
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
    <Box sx={{ width: '50%'}}>
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
        </Box>
          : 
        <Box>
            <Typography variant="h6">Group info</Typography>
            <Typography display="inline-block" variant="h6">Participants</Typography>
            <Button onClick={addParticipant} sx={{ ml: 2}} variant="contained">Add participant</Button>
            {currentConversation.participants.map(participant => {
              return (
                <Box key={participant._id}>
                  {participant.username}
                </Box>
              )
            })}
        </Box>}
    </Box>
  )
}
