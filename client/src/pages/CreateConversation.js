import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import axios from 'axios'
import { grey } from '@mui/material/colors'
import { useSocket } from '../contexts/socketContext'
import { useUser } from '../contexts/userContext'
import { useUsers } from '../contexts/usersContext'
import { useChat } from '../contexts/chatContext'
import SidebarUser from '../components/SidebarUser'
import { Chip, Paper, Fab } from '@mui/material'

import AddIcon from '@mui/icons-material/Add'
import Navbar from '../components/Navbar'
import AddParticipantModal from '../components/AddParticipantModal'
import { useSidebar } from '../contexts/sidebarContext'


function CreateConversation() {
  const { userID } = useUser()
  const { users } = useUsers()
  const [formData, setFormData] = useState({
    name: '',
    isPublic: 'public',
    participants: []
  })
  const navigate = useNavigate()
  const socket = useSocket()
  const { chatData, setChatData, currentConversation, setCurrentConversation} = useChat()

  const [open, setOpen] = useState(false)
  const [selectedParticipants, setSelectedParticipants] = useState([])
  const { tab, setTab, setPublicExpanded, setPrivateExpanded } = useSidebar()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })

    console.log(formData)
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    // reevalutate public and private to true and false
    const dataToSubmit = {
      ...formData,
      isDM: false,
      isPublic: formData.isPublic === 'public' ? true : false,
      participants: [{_id: userID, isAdmin: true}, ...formData.participants.map(participant => ({_id: participant, isAdmin: false}))]
    }

    console.log(dataToSubmit)

    socket.emitCreateConversation(dataToSubmit, conversation => {
      console.log(conversation)
      setChatData(prevChatData => {
        const chatDataDraft = JSON.parse(JSON.stringify(prevChatData))
        chatDataDraft.conversations.push(conversation)
        const getLastElem = arr => arr[arr.length - 1]
        setCurrentConversation(getLastElem(chatDataDraft.conversations))
        return chatDataDraft

      })
      setTab('conversations')
      if (conversation.isPublic) {
        setPublicExpanded(true)
      } else {
        setPrivateExpanded(true)
      }
      navigate('/chat')
    })
  }

  const addParticipants = selectedUsers => {
    setSelectedParticipants(selectedUsers)
    setFormData({...formData, participants: selectedUsers.map(u => u._id)})
    setOpen(false)
  }

  const addParticipant = user => {
    // exits if already added
    if (formData.participants.find(participant => participant._id === user._id))
      return

    // if not already added
    setFormData({
      ...formData,
      participants: [...formData.participants, user]
    })
  }

  return (
    <Paper square sx={{ 
      padding: '2vh 5vw' ,
      height: '100vh',
      width: '100vw'
		}}>
			<Navbar />
      <AddParticipantModal open={open} setOpen={setOpen} onSubmit={addParticipants} />
      <Typography textAlign="center" fontWeight="100" sx={{mb: 5}} variant="h4">Create Conversation</Typography>
      <form style={{ display: 'flex', flexGrow: 1}} onSubmit={ handleSubmit }>
        <Box sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '2vh',
        }}>
          <TextField 
            onChange={handleChange} 
            value={formData.name} 
            autoComplete="off" 
            name="name"
            label="Name"
            InputProps={{ sx: { borderRadius: '25px' }}}
          />
          <FormControl sx={{display: 'block'}}>
            <FormLabel sx={{ color: 'white'}}>Type</FormLabel>
            <RadioGroup
              defaultValue="public"
              name="isPublic"
              onChange={handleChange}
              row
            >
              <FormControlLabel value="public" control={<Radio />} label="Public" />
              <FormControlLabel value="private" control={<Radio />} label="Private" />
            </RadioGroup>
          </FormControl>
          <Box sx={{ display: 'flex', gap: 2}}>
            <Box sx={{ flexWrap: 'wrap', width: '50%', height: '100%', overflowY: 'auto', p:2, borderRadius: '25px', flexGrow: 1}}>
              <Typography display="inline" variant="h5">Participants</Typography><Button sx={{ ml: 2}} variant="contained" onClick={() => setOpen(true)}>Add</Button>
              <Box sx={{ }}>
                {selectedParticipants.map(participant => (
                  <Chip label={participant.username} />
                ))}
              </Box>
            </Box>
          </Box>
          <Box sx={{ width: '25%'}}>
            <Button sx={{ width: '100%', borderRadius: '25px', mt: 2, display: "block" }} type="submit" variant="contained">Create</Button>
            <Button sx={{ width: '100%', borderRadius: '25px', mt: 2}} variant="outlined" onClick={() => {navigate('/chat')}}>Cancel</Button>
          </Box>
        </Box>
      </form>
    </Paper>
  )
}

export default CreateConversation;