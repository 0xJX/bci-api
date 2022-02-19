const GetToken = request => 
{
  const auth = request.get('authorization')
  if (auth && auth.toLowerCase().startsWith('bearer '))
    return auth.substring(7)

  return null
}

module.exports = { GetToken };