import React from 'react'
import Box from '@mui/material/Box'
import { Typography, Grow, Fade } from '@mui/material'
import { useUser } from '../contexts/userContext'
import { useChat } from '../contexts/chatContext'

import DoneAllIcon from '@mui/icons-material/DoneAll'


export default function InfoMessage({message}) {

  return (
    <Fade in>
    <Box sx={{
      alignSelf: 'center'
    }}>
      <Typography display="inline-block" fontWeight="300" variant="body2" sx={{
        backgroundColor: 'info.dark',
        color: 'primary.contrastText',
        borderRadius: '10px',
        p: 1,
        maxWidth: '400px',
        wordWrap: 'break-word',
        textAlign: 'center'
      }}>
        { message.text }
      </Typography>
    </Box>
    </Fade>
  )
}
