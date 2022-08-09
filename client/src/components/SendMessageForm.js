import React from 'react'
import { useState } from 'react'
import { Box, TextField, Fab } from '@mui/material'
import SendIcon from '@mui/icons-material/Send';

import { v4 } from 'uuid'

import { useSocket } from '../contexts/socketContext'
import { useChat } from '../contexts/chatContext'
import { useUser } from '../contexts/userContext'


function SendMessageForm() {
  const { setChatData, currentConversation } = useChat()
  const socket = useSocket()
  const { user } = useUser()
  const [message, setMessage] = useState('')


  const handleSubmit = (e) => {
    e.preventDefault()
    // const text = e.target.message.value
    const text = message

    if (text !== '') {
      const generatedID = v4()
      const sentAt = new Date()
      socket.emitMessage({
        _id: generatedID,
        text,
        sender: {
          _id: user._id,
          username: user.username
        },
        sentAt: sentAt,
        conversation: currentConversation._id
      })
      setChatData(prevChatData => {
        const chatDataDraft = JSON.parse(JSON.stringify(prevChatData))
        const conversation = chatDataDraft.conversations.find(c => c._id === currentConversation._id)
        conversation.messages.push({
          _id: generatedID,
          sender: {
            _id: user._id,
            username: user.username
          },
          text,
          read: [],
          deliveries: [],
          sentAt: sentAt,
          conversation: currentConversation
        })
        
        // sort by latest first
        chatDataDraft.conversations = chatDataDraft.conversations.filter(c => c._id !== conversation._id)
        chatDataDraft.conversations.unshift(conversation)

        
        return chatDataDraft
      })
    }
    
    setMessage('')
  }

  const handleKeyDown = e => {
    //console.log(e.keyCode)
    if ((e.keyCode == 10 || e.keyCode == 13) && (e.shiftKey || e.metaKey)) {
      console.log('break line')
    } else if (e.keyCode == 10 || e.keyCode == 13) {
      handleSubmit(e)
    }
  }

  const handleChange = e => {
    //console.log(e.target.value)
    setMessage(e.target.value)
  }

 // console.log(user._id) // fix user issue
  const notInConversation = (!currentConversation.participants.find(p => p._id === user._id))

  return (
    <form>
      <Box 
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 2,
          m: 2,
        }}
        >
          <TextField 
            value={message}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            disabled={notInConversation}
            multiline
            maxRows={5}
            autoComplete="off" 
            color="primary"
            name="message" 
            label="Message"
            fullWidth 
            InputProps={{ sx: { borderRadius: '25px' }} }
          />
          <Box><Fab onClick={handleSubmit} disabled={notInConversation} type="submit" color="primary" size="large"><SendIcon/></Fab></Box> 
      </Box>
    </form>
  )
}

export default SendMessageForm;
