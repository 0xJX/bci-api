const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../model/user')

loginRouter.post('/', async (request, response) => 
{
  const body = request.body
  const user = await User.findOne({ username: body.username })
  const validPassword = user === null ? false : await bcrypt.compare(body.password, user.passwordHash)

  if (!(user && validPassword))
    return response.status(401).json({error: 'Invalid username or password'})

  const userToken = { username: user.username, id: user._id }
  const token = jwt.sign(userToken, process.env.TOKEN)

  response.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter