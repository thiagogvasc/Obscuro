const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')

const conversationService = require('./service/conversationService')
const dbConnect = require('./dbConnect')
const authRouter = require('./routes/authRouter')
const userRouter = require('./routes/userRouter')
const sessionMiddleware = require('./middleware/sessionMiddleware')
const webpush = require('web-push')
const app = express()

const Subscription = require('../src/models/subscriptionModel')

const init = async () => {
    // Initial store setup
    await dbConnect()
    const existingConversation = await conversationService.getConversationByName('General')
    if (!existingConversation) await conversationService.createConversation('General', true, false, [])
    
    app.use(cors({
        origin: 'http://localhost:3000',
        credentials: true
    }))
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use(express.static(path.join(__dirname, '../../client/build/')))
    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '../../client/build/index.html'))
    })
    app.get('/chat', (req, res) => {
      res.sendFile(path.join(__dirname, '../../client/build/index.html'))
    })
    app.get('/create-conversation', (req, res) => {
      console.log('create')
      res.sendFile(path.join(__dirname, '../../client/build/index.html'))
    })
    app.get('/signup', (req, res) => {
      res.sendFile(path.join(__dirname, '../../client/build/index.html'))
    })
    app.use(sessionMiddleware)
    app.use('/auth', authRouter)
    app.use((req, res, next) => {
        const session = req.session;
        if (session && session.userid) {
          next()
        } else {
          next(new Error("unauthorized"))
        }
    })
    app.use('/user', userRouter)


    // The new /save-subscription endpoint
    app.post('/save-subscription', async (req, res) => {
      const subscription = req.body
      console.log(subscription)
      // await saveToDatabase(subscription) //Method to save the subscription to Database

      const alreadySubscribed = await Subscription.findOne({_id: req.session.userid}).exec()
      if (alreadySubscribed) {
        return res.json({ message: 'already subscribed'})
      }

      console.log('saved subscription')
      console.log(subscription)
      const newSubscription = new Subscription({
        _id: req.session.userid,
        subscription
      })
      
      const savedSubscription = await newSubscription.save()
      console.log('saved sub')
      console.log(savedSubscription)



      res.json({ message: 'success', subscription: savedSubscription })
    })
const vapidKeys = {
  publicKey:
    'BJ5IxJBWdeqFDJTvrZ4wNRu7UY2XigDXjgiUBYEYVXDudxhEs0ReOJRBcBHsPYgZ5dyV8VjyqzbQKS8V7bUAglk',
  privateKey: 'ERIZmc5T5uWGeRxedxu92k3HnpVwy_RCnQfgek1x2Y4',
}
//setting our previously generated VAPID keys
webpush.setVapidDetails(
  'mailto:myuserid@email.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
)
//function to send the notification to the subscribed device
const sendNotification = (subscription, dataToSend) => {
  webpush.sendNotification(subscription, dataToSend)
}

//route to test send notification
app.get('/send-notification', (req, res) => {
  const subscription = dummyDb.subscription //get subscription from your databse here.
  const message = 'Hello World'
  console.log(subscription)

  

  sendNotification(subscription, message)
  res.json({ message: 'message sent' })
})
}

init()

module.exports = app