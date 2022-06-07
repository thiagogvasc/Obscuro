import React from 'react'

import Box from '@mui/material/Box'

export default function SideBar({users, selectReceiver}) {
  return (
    <Box>
      <h1>Side Bar</h1>
      <Box onClick={() => selectReceiver('general', true)} sx={{
        backgroundColor: 'red',
        '&:hover': {
          backgroundColor: 'black',
          cursor: 'pointer'
        }
      }}>
        {'general'}
      </Box>
      {users.map(user => {
          return (
            <>
              {console.log(user.username)}
              <Box onClick={() => selectReceiver(user.id, false)} sx={{
                backgroundColor: 'red',
                '&:hover': {
                  backgroundColor: 'black',
                  cursor: 'pointer'
                }
              }}>
                {user.username}
              </Box>
            </>
          )
      })} 
    </Box>
  )
}
