const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const authController = require('../../controllers/authController')
const userService = require('../../service/userService')

describe('auth controller', () => {
  let mongoServer

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()
    await mongoose.connect(uri)
  })

  afterEach(async () => {
    await mongoose.connection.dropDatabase()
  })

  afterAll(async () => {
    await mongoose.connection.close()
    await mongoServer.stop()
  })

  test('should sign up if username does not exist', async () => {
    const req = {
      body: {
        username: 'username_test',
        password: '123456'
      }
    }
    const res = {
      send: jest.fn()
    }

    await authController.signup(req, res)
    expect(res.send).toHaveBeenCalledWith('user created')
  })

  test('should not sign up if username already exists', async () => {
    const req = {
      body: {
        username: 'username_test',
        password: '123456'
      }
    }
    const res = {
      send: jest.fn()
    }

    // create user with existing username
    await userService.createUser('username_test', '123456')

    // signup
    await authController.signup(req, res)
    expect(res.send).toHaveBeenCalledWith('user already exists')
  })

  test('should not login if username is incorrect', async () => {
    const req = {
      body: {
        username: 'username_test',
        password: '123456'
      }
    }
    const res = {
      send: jest.fn()
    }

    // create user
    await userService.createUser('username_test123', '123456')

    // login attempt
    await authController.login(req, res)
    expect(res.send).toHaveBeenCalledWith('username not found')
  })

  test('should login if password if correct', async () => {
    const req = {
      body: {
        username: 'username_test',
        password: '123456'
      },
      session: {}
    }
    const res = {
      send: jest.fn()
    }

    // create user 
    await userService.createUserWithId('userid', 'username_test', '123456')

    // login
    await authController.login(req, res)
    expect(req.session.userid).toEqual('userid')
    expect(res.send).toHaveBeenCalledWith('logged in')
  })

  test('should not login if password is incorrect', async () => {
    const req = {
      body: {
        username: 'username_test',
        password: '123456'
      }
    }
    const res = {
      send: jest.fn()
    }

    // create user
    await userService.createUser('username_test', '123')

    // login attempt
    await authController.login(req, res)
    expect(res.send).toHaveBeenCalledWith('incorrect password')
  })
})