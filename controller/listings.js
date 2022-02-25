const listingRouter = require('express').Router()
const Listing = require('../model/listing')
const User = require('../model/user')
const jwt = require('jsonwebtoken')
const tokenHelper = require("./token");

listingRouter.get('/', async (request, response) => 
{
  var filter = {}
  if(request.query.category && request.query.location && request.query.date)
    filter = {category: request.query.category, location: request.query.location, date: request.query.date}
  else if(request.query.category && request.query.date)
    filter = {category: request.query.category, date: request.query.date}
  else if(request.query.location && request.query.date)
    filter = {location: request.query.location, date: request.query.date}
  else if(request.query.category && request.query.location)
    filter = {category: request.query.category, location: request.query.location}
  else if(request.query.category)
    filter = {category: request.query.category}
  else if(request.query.location)
    filter = {location: request.query.location}
  else if(request.query.date)
    filter = {date: request.query.date}
  else if(request.query.id)
    filter = {id: request.query.id}

  const listings = await Listing.find(filter).populate('user', ['name', 'phonenumber', 'email'])
  if (listings)
    response.json(listings.map(listing => listing.toJSON()))
  else
    response.status(404).end()
})

listingRouter.post('/', async (request, response) => 
{
  const body = request.body
  const token = tokenHelper.GetToken(request)

  if (token == null)
    return response.status(401).json({ error: 'Token missing or invalid' })

  const decodedToken = jwt.verify(token, process.env.SECRET_KEY)

  if (!token || !decodedToken.id)
    return response.status(401).json({ error: 'Token missing or invalid' })

  const user = await User.findById(decodedToken.id)

  const listing = new Listing(
  {
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

listingRouter.delete('/', async (request, response) => 
{
  try 
  {
    const id = request.query.id
    const listing = await Listing.findById(id)
    const token = tokenHelper.GetToken(request)

    if (token == null)
      return response.status(401).json({ error: 'Token missing or invalid' })

    if (!listing)
      return response.status(400).json({ error: `No listings found with the id: ${id}`})

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY)
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