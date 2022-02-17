const listingRouter = require('express').Router()
const Listing = require('../model/listing')
const User = require('../model/user')
const jwt = require('jsonwebtoken')

const GetToken = request => 
{
  const auth = request.get('authorization')

  if (auth && auth.toLowerCase().startsWith('bearer '))
    return auth.substring(7)

  return null
}

listingRouter.get('/', async (_request, response) => 
{
  const listings = await Listing.find({}).populate('user', ['name', 'phonenumber', 'email'])
  response.json(listings.map(listing => listing.toJSON()))
})

listingRouter.post('/', async (request, response) => 
{
  const body = request.body
  const token = GetToken(request)

  if (token == null)
    return response.status(401).json({ error: 'Token missing or invalid' })

  const decodedToken = jwt.verify(token, process.env.TOKEN)

  if (!token || !decodedToken.id)
    return response.status(401).json({ error: 'Token missing or invalid' })

  const user = await User.findById(decodedToken.id)

  const listing = new Listing({
    title: body.title,
    description: body.description,
    category: body.category,
    location: body.location,
    images: body.images,
    price: body.price,
    date: Date.now(),
    deliverytype: body.deliverytype,
    user: user.id
  })

  const savedListing = await listing.save()
  user.listings = user.listings.concat(savedListing._id)
  await user.save()
  response.json(savedListing.toJSON())
})

listingRouter.get('/:id', async (request, response) => 
{
  const listing = await Listing.findById(request.params.id)
  if (listing)
    response.json(listing.toJSON())
  else
    response.status(404).end()
})

listingRouter.delete('/:id', async (request, response) => 
{
  try 
  {
    const id = request.params.id
    const listing = await Listing.findById(id)
    const token = GetToken(request)

    if (token == null)
      return response.status(401).json({ error: 'Token missing or invalid' })

    if (!listing)
      return response.status(400).json({ error: `No listings found with the id: ${id}`})

    const decodedToken = jwt.verify(token, process.env.TOKEN)
    if (!decodedToken.id)
      return response.status(401).json({ error: 'Missing or invalid token' })

    if (listing.user.toString() !== decodedToken.id)
      return response.status(401).json({ error: 'Not authorized' })

    const deletedListing = await Listing.findByIdAndRemove(id)
    response.json(deletedListing.toJSON())
  } 
  catch (exception) 
  {
    return response.status(400).json({ error: 'Bad request' })
  }
})

module.exports = listingRouter