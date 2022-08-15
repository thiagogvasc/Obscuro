import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import GroupsIcon from '@mui/icons-material/Groups';

export default function ConversationAvatar() {
  return (
    <Avatar sx={{ width: '100%', height: '100%', backgroundColor: 'primary.light', color: 'white'}}>
      <GroupsIcon fontSize="large" />
    </Avatar>
  )
}