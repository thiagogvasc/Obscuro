import React, { useState, useEffect, createContext, useContext } from 'react'
import { useSocket } from './socketContext'
import { UserProvider, useUser } from './userContext'


const chatContext = createContext()

export function ChatProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true)
  const [chatData, setChatData] = useState({conversations: []})
  const [currentConversation, setCurrentConversation] = useState({name: '', messages: []})
  const socket = useSocket()
  const { userID } = useUser()
  //console.log(currentConversation)

  //Sort conversations by latest first
  // useEffect(() => {
  //   setChatData(prevChatData => {
  //     const chatDataDraft = JSON.parse(JSON.stringify(prevChatData))
  //     chatDataDraft.conversations.sort((conv1, conv2) => {
  //       const lastMessage1 = conv1.messages[conv1.messages.length - 1]
  //       const lastMessage2 = conv2.messages[conv2.messages.length - 1]

  //       if (!(lastMessage1 && lastMessage2)) return 0
        
  //       console.log(userID)
  //       console.log({conv1, conv2, lastMessage1, lastMessage2})
  //       const deliveryToMe1 = lastMessage1.deliveries.find(d => d.to === userID)
  //       const deliveryToMe2 = lastMessage2.deliveries.find(d => d.to === userID)
  //       console.log(deliveryToMe1)
  //       return (new Date(deliveryToMe1.at) < new Date(deliveryToMe2.at)) - (new Date(deliveryToMe1.at) > new Date(deliveryToMe2.at))
  //     })
  //     return chatDataDraft
  //   })
  // }, [chatData.conversations])


  // Necessary to update the object reference
  // currentConversation references the chatData.conversations[?] object
  // needs to point to the same object in order to reflect the changes
  useEffect(() => {
    chatData.conversations.forEach(conv => {
      if (conv._id === currentConversation._id) {
        setCurrentConversation(conv)
        console.log('changed reference')
      }
    })
  }, [chatData])

  const getConvName = (conversation) => {
    // console.log(conversation)
    // console.log(chatData._id)
    if (conversation.isDM) {
      const [participant1, participant2] = conversation.participants
      if (participant1._id === userID) { // is self
        return participant2.username
      }
      return participant1.username
    }
    return conversation.name
  }

  useEffect(() => {
    socket.initConnection()
    socket.emitJoinChat()
    socket.onChatJoined(user => {
      user.conversations.forEach(conversation => {
        conversation.name = getConvName(conversation)
        console.log(conversation.name)
      })

      // sorting conversations
      user.conversations.sort((conv1, conv2) => {
        const lastMessage1 = conv1.messages[conv1.messages.length - 1]
        const lastMessage2 = conv2.messages[conv2.messages.length - 1]

        if (!(lastMessage1 && lastMessage2)) return 0
        
        // console.log(userID)
        // console.log({conv1, conv2, lastMessage1, lastMessage2})
        const deliveryToMe1 = lastMessage1.deliveries.find(d => d.to === userID)
        const deliveryToMe2 = lastMessage2.deliveries.find(d => d.to === userID)
        // console.log(deliveryToMe1)
        return (new Date(deliveryToMe1.at) < new Date(deliveryToMe2.at)) - (new Date(deliveryToMe1.at) > new Date(deliveryToMe2.at))
      })

      console.log('chat joined')
      // console.log(user)
      setChatData(user)
      setCurrentConversation(user.conversations.find(conv => conv.name === 'General'))
      setIsLoading(false)
    })
    socket.onMessage(message => {
      // console.log({message})
      // console.log(new Date(message.sentAt))
      setChatData(prevChatData => {
        const chatDataDraft = JSON.parse(JSON.stringify(prevChatData))
        const conversation = message.conversation
        // console.log('before adding message', {chatDataDraft})
        chatDataDraft.conversations.forEach(conv => {
          if (conv._id === conversation._id) {
            conv.messages.push(message)
          }
        })
        // sort conversationg by latest first
        // MOVE THIS TO JOIN CHAT EVNET
        // HERE DO SAME THING THAT IT DOES ON EMIT MESSAGE
        // chatDataDraft.conversations.sort((conv1, conv2) => {
        //   const lastMessage1 = conv1.messages[conv1.messages.length - 1]
        //   const lastMessage2 = conv2.messages[conv2.messages.length - 1]

        //   if (!(lastMessage1 && lastMessage2)) return 0
          
        //   console.log(userID)
        //   console.log({conv1, conv2, lastMessage1, lastMessage2})
        //   const deliveryToMe1 = lastMessage1.deliveries.find(d => d.to === userID)
        //   const deliveryToMe2 = lastMessage2.deliveries.find(d => d.to === userID)
        //   console.log(deliveryToMe1)
        //   return (new Date(deliveryToMe1.at) < new Date(deliveryToMe2.at)) - (new Date(deliveryToMe1.at) > new Date(deliveryToMe2.at))
        // })
        // sort by latest first

        // find conversation with messages from chatDataDraft because the "conversations" field
        // from the messages ovject does not contain the messages of each conversation
        const aggregateConv = chatDataDraft.conversations.find(c => c._id === conversation._id)
        chatDataDraft.conversations = chatDataDraft.conversations.filter(c => c._id !== conversation._id)
        chatDataDraft.conversations.unshift(aggregateConv)
        // console.log('after', {chatDataDraft})
        return chatDataDraft
      })
      // socket.socketRef.current.emit('message-delivered', { 
      //   messageID: message._id,
      //   conversationID: message.conversation._id,
      //   delivery: {
      //     to: userID, 
      //     at: new Date() 
      //   }
      // })
    })

    socket.socketRef.current.on('message-delivered', ({conversationID, messageID, delivery}) => {
      console.log('deliverddd')
      setChatData(prevChatData => {
        const chatDataDraft = JSON.parse(JSON.stringify(prevChatData))
        const conversation = chatDataDraft.conversations.find(c => c._id === conversationID)
        conversation.messages.forEach(message => {
          if (message._id === messageID) {
            message.deliveries.push(delivery)
          }
        })
        // console.log(chatDataDraft)

        return chatDataDraft
      })
    })

    socket.socketRef.current.on('message-liked', ({conversationID, messageID, like}) => {
      console.log('liked')
      setChatData(prevChatData => {
        const chatDataDraft = JSON.parse(JSON.stringify(prevChatData))
        const conversation = chatDataDraft.conversations.find(c => c._id === conversationID)
        conversation.messages.forEach(message => {
          if (message._id === messageID) {
            console.log('pushed like')
            message.likes.push(like)
          }
        })
        // console.log(chatDataDraft)

        return chatDataDraft
      })
    })

    socket.socketRef.current.on('new-conversation', conversation => {
      // console.log(conversation)
      setChatData(prevChatData => {
        const chatDataDraft = JSON.parse(JSON.stringify(prevChatData))
        const alreadyExists = chatDataDraft.conversations.find(c => c._id === conversation._id)
        if (!alreadyExists) {
          chatDataDraft.conversations.push({...conversation, name: getConvName(conversation)})
        }
        return chatDataDraft
      })
    })

    socket.socketRef.current.on('new-participants', ({conversationID, participants}) => {
      setChatData(prevChatData => {
        const chatDataDraft = JSON.parse(JSON.stringify(prevChatData))
        const conversation = chatDataDraft.conversations.find(conv => conv._id === conversationID)
        conversation.participants.push(...participants)
        return chatDataDraft
      })
    })

    socket.socketRef.current.on('participant-removed', ({conversationID, participant}) => {
      setChatData(prevChatData => {
        const chatDataDraft = JSON.parse(JSON.stringify(prevChatData))
        const conversation = chatDataDraft.conversations.find(conv => conv._id === conversationID)
        conversation.participants = conversation.participants.filter(p => p._id !== participant._id)
        // console.log(chatDataDraft)
        return chatDataDraft
      })
    })

    socket.socketRef.current.on('participant-promoted', ({conversationID, participantID}) => {
      setChatData(prevChatData => {
        const chatDataDraft = JSON.parse(JSON.stringify(prevChatData))
        const conversation = chatDataDraft.conversations.find(conv => conv._id === conversationID)
        const promotedParticipant = conversation.participants.find(p => p._id === participantID)
        promotedParticipant.isAdmin = true
        // console.log(chatDataDraft)
        return chatDataDraft
      })
    })

    socket.socketRef.current.on('conversation-opened', ({ conversationID, openedBy }) => {
      setChatData(prevChatData => {
        const chatDataDraft = JSON.parse(JSON.stringify(prevChatData))
        const conversation = chatDataDraft.conversations.find(conversation => conversation._id === conversationID)
        if (conversation) {
          conversation.messages.forEach(message => {
            if (message.read.filter(read => read.by === openedBy.by).length > 0) return
            message.read.push(openedBy)
          })
        }
        // console.log('after opening')
        // console.log(chatDataDraft)
        return chatDataDraft
      })
    })
  }, [])

  const value = {
    chatData,
    setChatData,
    currentConversation,
    setCurrentConversation,
    isLoading
  }

  return (
    <chatContext.Provider value={ value }>
      { children }
    </chatContext.Provider>
  )
}

export const useChat = () => {
  return useContext(chatContext)
}
