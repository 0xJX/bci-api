const app = require('./app')
const http = require('http')
const port = process.env.PORT

http.createServer(app).listen(port, () => { console.log(`Server is running on port ${port}`)})