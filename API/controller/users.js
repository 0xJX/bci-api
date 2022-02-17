const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../model/user')

usersRouter.post('/', async (request, response, next) => 
{
  try 
  {
    const body = request.body
    console.log(body)
    const passwordHash = await bcrypt.hash(body.password, 10)

    const user = new User({
      username: body.username,
      name: body.name,
      phonenumber: body.phonenumber,
      email: body.email,
      passwordHash,
    })

    const savedUser = await user.save()
    response.json(savedUser)
  } catch (exception) 
  {
    next(exception)
  }
})

usersRouter.get('/', async (_request, response) => 
{
  const users = await User.find({}).populate('listings')
  response.json(users.map(user => user.toJSON()))
})

module.exports = usersRouter