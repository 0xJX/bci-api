const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../model/user')
const tokenHelper = require("./token");

usersRouter.post('/', async (request, response, next) => 
{
  try 
  {
    const body = request.body
    console.log(body)
    const passwordHash = await bcrypt.hash(body.password, 10)

    const user = new User(
    {
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
  if (users)
    response.json(users.map(user => user.toJSON()))
  else
    response.status(404).end()
})

usersRouter.delete('/', async (request, response) => 
{
  try 
  {
    const id = request.query.id;
    const user = await User.findById(id)
    const token = tokenHelper.GetToken(request)

    if (token == null)
      return response.status(401).json({ error: 'Token missing or invalid' })

    if (!user)
      return response.status(400).json({ error: `No users found with the id: ${id}`})

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY)
    if (!decodedToken.id)
      return response.status(401).json({ error: 'Missing or invalid token' })

    if (user !== decodedToken.id)
      return response.status(401).json({ error: 'Not authorized' })

    const deletedUser = await user.findByIdAndRemove(id)
    response.json(deletedUser.toJSON())
  } 
  catch (exception) 
  {
    return response.status(400).json({ error: 'Bad request' })
  }
})


module.exports = usersRouter