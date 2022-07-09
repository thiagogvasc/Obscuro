import React from 'react'
import Box from '@mui/material/Box'
import { Typography } from '@mui/material'
import { useUser } from '../contexts/userContext'


export default function Message({message}) {
  //const fromSelf = message.sender.id === user.id
  const { userID } = useUser()
  console.log('sender: ' + message.sender)
  console.log('me: ' + userID)
  const fromSelf = message.sender._id === userID
  return (
    <Box sx={{
      alignSelf: fromSelf ? 'flex-end' : 'flex-start',
      textAlign: fromSelf ? 'right' : 'left',
    }}>
      {/* <Typography sx={{ color: 'white' }} variant="body1">{ message.sender.username }: </Typography> */}
      <Typography fontWeight="300" variant="body2" sx={{
        backgroundColor: '#1976d2',
        color: 'white',
        borderRadius: '10px',
        p: 1,
        maxWidth: '200px',
        wordWrap: 'break-word',
        float: fromSelf ? 'right' : 'left',
      }}>
        { message.text }
      </Typography>
    </Box>
  )
}
