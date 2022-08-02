const { Server } = require('socket.io')
const registerConversationEvents = require('./events/conversationEvents')
const registerMessageEvents = require('./events/messageEvents')
const registerUserEvents = require('./events/userEvents')
const sessionMiddleware = require('./middleware/sessionMiddleware')

//FIX
const userService = require('./service/userService')


let io = null
const init = (server, options) => {
  io = new Server(server, options)
  const wrap = middleware => (socket, next) => middleware(socket.request, {}, next)
  io.use(wrap(sessionMiddleware))
  io.of("/").adapter.on("join-room", (room, id) => {
   // console.log(`socket ${id} has joined room ${room}`)
  })
  
  io.use((socket, next) => {
    const session = socket.request.session;
    if (session && session.userid) {
      socket.id = session.userid
      next()
    } else {
      next(new Error("unauthorized"))
    }
  })
  io.on('connection', async socket => {
    //console.log('connectin: ', socket.request.session)
    const userID = socket.request.session.userid

    // !!!!! crashes on start when user connects to fast !!!!!
    
    // handle session if (!session) res.redirect()
    // join all rooms on reconnect
    // prevents lost rooms on server restart
    userService.getUserById(userID).then(user => {
      user.conversations.forEach(conversation => socket.join(conversation))
    })
    registerUserEvents(socket, io)
    registerMessageEvents(socket, io)
    registerConversationEvents(socket, io)
    
    socket.on('disconnect', () => console.log('disconnect'))
  })
}

module.exports = { io, init }