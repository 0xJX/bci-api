const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const listingRouter = require('./controller/listings')
const usersRouter = require('./controller/users')
const loginRouter = require('./controller/login')
const app = express()
require('dotenv').config()

console.log('Connecting to', process.env.MONGO_URI)

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {console.log('Connected to MongoDB')})
  .catch((error) => { console.log('Error connection to MongoDB:', error.message) })

app.use(cors())
app.use(express.json())
app.use('/api/users', usersRouter)
app.use('/api/listings', listingRouter)
app.use('/api/login', loginRouter)

module.exports = app