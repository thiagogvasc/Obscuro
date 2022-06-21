const {sessions} = require('../../store/sessionStore')
const { uuid } = require('uuidv4')

module.exports = (socket, next) => {
  console.log('middlware')
  const sessionID = socket.handshake.auth.sessionID;
  if (sessionID) {
      if (sessions[sessionID]) {
          const userID = sessions[sessionID]
          socket.id = userID
          socket.sessionID = sessionID
          socket.emit('authorized')
          return next()
      }
      return next(new Error('invalid session'))
  }

  // create new session
  const newSession = uuid()
  socket.sessionID = newSession
  sessions[newSession] = socket.id
  return next();
}