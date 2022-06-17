import { useSocket } from '../contexts/socketContext'
import { useState, useEffect } from 'react'

export function useUsers() {
  const [users, setUsers] = useState([])
  const socket = useSocket()

  useEffect(() => {
    socket.onUsers(users => {
      setUsers(users)
    })
    
    socket.joinRoom('General')
  }, [])

  return { users }
}