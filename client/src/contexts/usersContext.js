import React, { useContext, useEffect } from 'react'
import { createContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '../contexts/socketContext'
import { useUser } from '../contexts/userContext'

import axios from 'axios'
import { baseUrl } from '../axiosConfig'


const usersContext = createContext({})

export function UsersProvider({ children }) {
  const [users, setUsers] = useState([])
  const { userID } = useUser()
  
  useEffect(() => {
    axios.get(`${baseUrl}/user`, { withCredentials: true }).then(res => {
      const filteredUsers = res.data.filter(u => u._id !== userID)
      setUsers(filteredUsers)
    })
  }, [])

  const value = {
    users
  }

  return (
    <usersContext.Provider value={ value }>
      { children }
    </usersContext.Provider>
  )
}

export const useUsers = () => {
  return useContext(usersContext)
}
