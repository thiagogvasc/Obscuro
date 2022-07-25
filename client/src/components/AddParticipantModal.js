import React, { useState } from 'react'

import { Box, Paper, Typography, Button, Checkbox, Modal, Chip, Grow, Zoom } from '@mui/material'
import { grey } from '@mui/material/colors'
import CloseIcon from '@mui/icons-material/Close'

import { useChat } from '../contexts/chatContext'
import { useUsers } from '../contexts/usersContext'
import { useSocket } from '../contexts/socketContext'

export default function AddParticipantModal({open, setOpen}) {
  const { users } = useUsers()
  const { currentConversation } = useChat()
  const [selectedUsers, setSelectedUsers] = useState([])

  const { socketRef } = useSocket()


  const handleClose = () => {
    setOpen(false)
    setSelectedUsers([])
  }

  const handleCheckboxChange = (e, user) => {
    if (e.target.checked) {
      setSelectedUsers([...selectedUsers, user])
    } else {
      setSelectedUsers(selectedUsers.filter(u => u !== user))
    }
  }

  const add = () => {
    socketRef.current.emit('add-participants', {
      conversationID: currentConversation._id,
      participantsIDs: selectedUsers.map(u => u._id)
    })
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Paper elevation={1} sx={{ 
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '75%',
        height: '75%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        color: 'white',
      }}>
        <Paper elevation={2} square sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1}}>
          <Typography variant="h5">Add Participants</Typography>
          <Button onClick={handleClose}><CloseIcon fontSize="large" color="primary" /></Button>
        </Paper>
        <Box>
          <Typography sx={{ p:1 }} display="inline-block">Selected Users: </Typography>
          {selectedUsers.map(user => (
            <Chip sx={{ mx: 1 }} color="primary" label={user.username}/>
          ))}
        </Box>
        
        
        <Box sx={{ flexGrow: 1, p: 2}}>
          {users.map(user => (
            <Box key={user._id}>
              <Typography display="inline-block" variant="h6">{user.username}</Typography>
              <Checkbox onChange={(e) => handleCheckboxChange(e, user)}/>
            </Box>
          ))}
        </Box>
        <Box sx={{alignSelf: 'flex-end', p: 3}}>
          <Button size="large" variant="outlined" sx={{ mr: 2}} onClick={handleClose}>Cancel</Button>
          <Button size="large" variant="contained" onClick={add}>Add</Button>
        </Box>
      </Paper>
    </Modal>
  )
}
