const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')


module.exports = async () => {
  const mongoServer = await MongoMemoryServer.create()
  console.log('connecting...')
  await mongoose.connect(mongoServer.getUri())
  return mongoServer.getUri()
}
