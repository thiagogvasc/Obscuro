const session = require('express-session')
const MongoStore = require('connect-mongo')


const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGODB_URI,
  collectionName: 'sessions'
})

module.exports = session({
  secret: 'some secret',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
      maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
})
