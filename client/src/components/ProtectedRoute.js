import React, { useEffect } from 'react'
import { useUser } from '../contexts/userContext'
import { useSocket } from '../contexts/socketContext'
import { useNavigate } from 'react-router-dom'

import axios from 'axios'

function ProtectedRoute({ children }) {
    const socket = useSocket()
    const navigate = useNavigate()
    const {userID, setUserID} = useUser()

    useEffect(() => {
        if (socket.connectError) {
            console.log(socket.connectError)
            if (socket.connectError.message === 'unauthorized') {
                navigate('/')
            }
        }
    }, [socket])

    useEffect(() => {
        axios.get('http://localhost:8080/auth', { withCredentials: true }).then(res=> {
            console.log(res)
            setUserID(res.data)
        }).catch(err => {
            console.log(err)
            const response = err.response
            if (response.statusText === 'Forbidden') {
                console.log('forbiddennnnnnn')
            }
        })
    }, [])
    return (<>{ userID ? children : 'not authenticatedddd'}</>)
}

export default ProtectedRoute