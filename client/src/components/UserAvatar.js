import Box from '@mui/material/Box'
import Avatar from 'avataaars'


export default function UserAvatar({user}) {
  return (
      <Avatar
        style={{ width: '100%', height: '100%'}}
        avatarStyle='Circle' 
        {...JSON.parse(user.avatarOptions) } 
      />
  )
}
