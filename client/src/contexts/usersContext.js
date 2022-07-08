import React, { useContext, useEffect } from 'react'
import { createContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '../contexts/socketContext'

import axios from 'axios'


const usersContext = createContext({})

export function UsersProvider({ children }) {
  const [users, setUsers] = useState([])
  
  useEffect(() => {
    console.log('sending request')
    axios.get('http://localhost:8080/user').then(res => {
      console.log(res.data)
      setUsers(res.data)
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
