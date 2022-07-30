const session = require('express-session')
const MongoStore = require('connect-mongo')

console.log('line 4')
console.log(process.env.MONGODB_URI)
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
