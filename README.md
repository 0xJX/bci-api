# bci-api

[![Javascript](https://img.shields.io/badge/language-Javascript-yellow.svg?style=plastic)](https://en.wikipedia.org/wiki/Javascript) 
[![Web](https://img.shields.io/badge/platform-Web-0078d7.svg?style=plastic)](https://en.wikipedia.org/wiki/Web_platform) 

Building Cloud Integration Exercise - Advanced Studies of Software Development Spring 2022

Webstore backend.
- OpenAPI
- Mocha + Chai testing
- MongoDB Database + Hosting
- Heroku API Hosting
- Stoplight generated JSON documentation

## Local testing environment setup
- Clone the repository
- npm install all the required node modules.

Add environment file (.env) to root repo folder with your MongoDB url and keys in this format

    MONGO_URI = mongodb+srv://yourURLhere
    SECRET_KEY = 32characterslongstringhere
    PORT = 80

## Running the local API
Run the server with this command:

    node index.js
Run the mocha tests with this command:

    npm test
## Hosted API URL
    bciapi.herokuapp.com

## Hosted documentation
    https://bciapi.stoplight.io/docs/bci-api/YXBpOjIzMzE3MTA-bci-api-documentation
Please note, the API calls will not work from the stoplight due to CORS issues, you can use postman to manually test the hosted api url.
[Open in web browser](https://bciapi.stoplight.io/docs/bci-api/YXBpOjIzMzE3MTA-bci-api-documentation)
