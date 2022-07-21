import React from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import { Avatar, Typography, Badge } from '@mui/material'
import { grey } from '@mui/material/colors'
import { useChat } from '../contexts/chatContext'
import { useUser } from '../contexts/userContext'
import { useSocket } from '../contexts/socketContext'

export default function SidebarChat({ conversation, shouldOpenSidebar, setShouldOpenSidebar}) {
  const { chatData, currentConversation, setCurrentConversation } = useChat()
  const { userID } = useUser()
  const shouldHighlight = conversation._id === currentConversation._id
  const socket = useSocket()

  const getNumberOfUnreadMessages = () => {
    let count = 0
    conversation.messages.forEach(message => {
      if (message.conversation._id === currentConversation._id) return
      if (!message.readBy.includes(userID)) count++
    })
    return count
  }

  const numberOfUnreadMessages = getNumberOfUnreadMessages()

  const getConvName = () => {
    if (conversation.isDM) {
      const [participant1, participant2] = conversation.participants
      if (participant1._id === chatData._id) { // is self
        return participant2.username
      }
      return participant1.username
    }
    return conversation.name
  }

  const select = () => {
    setCurrentConversation({
      ...conversation,
      name: getConvName()
    })
    // setshouldopensdebar(true)
  }

  const getLastMessage = () => {
    const messages = conversation.messages
    if (messages.length <= 0) return null

    const lastMessage = messages[messages.length - 1]
    return lastMessage
  }
  
  return (
    // mayve just pass the whole receiver
    <Paper square elevation={3} onClick={select} sx={{
      display: 'flex',
      transition: 'background-color .2s',
      backgroundColor: shouldHighlight && 'action.selected',
      '&:hover': {
        backgroundColor: 'action.hover',
        cursor: 'pointer'
      }
    }}>
      <Avatar sx={{ width: '50px', height: '50px', m: 2 }}/>
      <Box sx={{ alignSelf: 'center', fontWeight:'100' }}>
        <Typography variant="body1" sx={{ }}>{getConvName()}</Typography>
        <Typography variant="body2" sx={{ color: 'darkgray'}}>{getLastMessage()?.text.length > 10 ? getLastMessage()?.text.substring(1, 10) + '...' : getLastMessage()?.text}</Typography>
      </Box>
      <Box sx={{ pr: 3, flexGrow: 1, display: 'flex', justifyContent: 'end', alignItems: 'center'}}>
      {numberOfUnreadMessages ? 
        <Box sx={{ width: '25px', height: '25px', borderRadius: '50%', backgroundColor: 'primary.main', textAlign: 'center'}}>
          <Typography variant="body1">{numberOfUnreadMessages}</Typography>
        </Box>
        : 
        null
      }
      </Box>
    </Paper>
  )
}
