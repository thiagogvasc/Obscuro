import React from 'react'

import Box from '@mui/material/Box'
import { Avatar, Typography, Button, Fab } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'


import { grey } from '@mui/material/colors'

import { useSocket } from '../contexts/socketContext'
import { useChat } from '../contexts/chatContext'
import { useUser } from '../contexts/userContext'
import { useSidebar } from '../contexts/sidebarContext'

export default function SidebarUser({ user, shouldOpenSidebar, setShouldOpenSidebar}) {
  const { chatData, setChatData, setCurrentConversation } = useChat()
  const socket = useSocket()
  const { userID } = useUser()
  const { setTab, setPublicExpanded, setPrivateExpanded } = useSidebar()

  const select = () => {
    for (const conversation of chatData.conversations) {
      if (conversation.isDM) {
        // userID => client
        const [participant1, participant2] = conversation.participants
        if ((participant1._id === userID && participant2._id === user._id)
            || (participant1._id === user._id && participant2._id === userID)) {
          setTab('conversations')
          if (conversation.isPublic) {
            setPublicExpanded(true)
          } else {
            setPrivateExpanded(true)
          }
          setCurrentConversation(conversation)
          return
        }
      }
    }

    const newConversation = {
      name: '',
      isPublic: false,
      isDM: true, 
      participants: [{_id: userID, isAdmin: false}, {_id: user._id, isAdmin: false}]
    }
    socket.emitCreateConversation(newConversation, conversation => {

      // setCurrentConversation here
      setChatData(prevChatData => {
        const chatDataDraft = JSON.parse(JSON.stringify(prevChatData))
        conversation.name = user.username // other user
        chatDataDraft.conversations.push(conversation)
        const getLastElem = arr => arr[arr.length - 1]
        setCurrentConversation(getLastElem(chatDataDraft.conversations))
        return chatDataDraft
      })
      setTab('conversations')
      if (newConversation.isPublic) {
        setPublicExpanded(true)
      } else {
        setPrivateExpanded(true)
      }
    })
  }

  // rename to isActive?
  return (
    // mayve just pass the whole receiver
    <Box sx={{
      display: 'flex'
    }}>
      <Avatar sx={{ width: '50px', height: '50px', m: 2 }}/>
      <Box sx={{ alignSelf: 'center', fontWeight:'100', overflow: 'hidden', textOverflow: 'ellipsis'}}>
        <Typography noWrap variant="body1" sx={{ color: '#FFFFFF'}}>{user.username}</Typography>
        <Fab onClick={select} color="primary" size="small" variant="extended"><SendIcon/>Send message</Fab>
      </Box>
    </Box>
  )
}
