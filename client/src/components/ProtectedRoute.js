import React, { useEffect } from 'react'
import { useUser } from '../contexts/userContext'
import { useSocket } from '../contexts/socketContext'
import { useNavigate, Navigate } from 'react-router-dom'
import Login from '../pages/Login'

import axios from 'axios'
import { baseUrl } from '../axiosConfig'


function ProtectedRoute({ children }) {
    const socket = useSocket()
    const navigate = useNavigate()
    const {userID, setUserID, user, setUser} = useUser()

    useEffect(() => {
        if (socket.connectError) {
            console.log(socket.connectError)
            if (socket.connectError.message === 'unauthorized') {
                navigate('/')
            }
        }
    }, [socket])

    useEffect(() => {
        axios.get(`${baseUrl}/auth`, { withCredentials: true }).then(res=> {
            console.log(res)
            setUserID(res.data.userid)
            setUser(res.data.user)
        }).catch(err => {
            console.log(err)
            const response = err.response
            if (response.statusText === 'Forbidden') {
                console.log('forbiddennnnnnn')
            }
        })
    }, [])
    return (<>{ userID ? children : 'not authenticated' }</>)
}

export default ProtectedRoute