const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')


module.exports = async () => {
  //const mongoServer = await MongoMemoryServer.create()
  console.log('connecting...')
  //await mongoose.connect(mongoServer.getUri())
  if (process.env.NODE_ENV === 'development') {
    const mongoServer = await MongoMemoryServer.create({
      instance: {
        port: 8081
      }
    })
    const mongoServerURI = mongoServer.getUri()
    // process.env.MONGODB_URI = mongoServerURI
    console.log('connecting to local database')
    console.log(mongoServerURI)
    await mongoose.connect(mongoServerURI)
  } else {
    // production
    await mongoose.connect(process.env.MONGODB_URI)
  }
}