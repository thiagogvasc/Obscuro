const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");
const mongoose = require('mongoose')

const { MongoMemoryServer } = require('mongodb-memory-server')

const registerMessageEvents = require('../../eventHandlers/messageHandler')
const conversationService = require('../../service/conversationService')
const userService = require('../../service/userService');
const messageService = require('../../service/messageService')

describe("message event handler", () => {
  let io
  let serverSocket
  let clientSocket
  let mongoServer
  let port
  let db

  //let generalConversation

  beforeAll(async () => {
    // setup server
    const httpServer = createServer()
    io = new Server(httpServer)
    httpServer.listen(() => {
      port = httpServer.address().port
      io.on("connection", (socket) => {
        serverSocket = socket;
        registerMessageEvents(socket, io)
      })
    })

    mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()
    await mongoose.connect(uri)
    return new Promise((resolve, reject) => {
      clientSocket = new Client(`http://localhost:${port}`)
      clientSocket.on('connect', () => {
        console.log('connected')
        resolve()
      })
    })
  });


  afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    await mongoServer.stop()
    io.close()
    clientSocket.close()
  });

  test("should receive message properly", async () => {
    const user = await userService.createUser('username_test', serverSocket.id)
    const general = await conversationService.createConversation('General', true, false, [])
    await conversationService.addParticipantToConversationByName(general.name, user._id)
    await userService.addConversationToUserById(user._id, general._id)

    serverSocket.join(general._id)

    return new Promise((resolve, reject) => {
      clientSocket.on("message", message => {
        expect(message).toEqual(
          expect.objectContaining({
            text: 'new_message',
            sender: expect.objectContaining({
              _id: serverSocket.id
            }),
            conversation: expect.objectContaining({
              _id: general._id
            })
          })
        )
        
        resolve()
      })
  
      clientSocket.emit('message', {
        text: 'new_message',
        sender: serverSocket.id,
        conversation: general._id
      })
    })
  })
})