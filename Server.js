const express = require('express')
const cors = require('cors')
const app = express()
const config = require('./config')
const utils = require('./utils')
const jwt = require("jsonwebtoken")




app.use(cors())
app.use(express.json())


app.use((request, response, next) => {
  if (request.url == '/coco/register' || request.url == '/coco/login') {
    next()
  } else {
    let token = request.headers['authorization']
   
    if (!token) {
      response.send(utils.createError('token is missing'))
      return
    }

    token = token.replace('Bearer', '').trim()

    try {
      if (jwt.verify(token, config.secret)) {
        console.log(token)
        const payload = jwt.decode(token)
        console.log(payload)
        request['userInfo'] = payload
        next();
      } else {
        response.send(utils.createError('invalid token'))
      }
    } catch (ex) {
      response.send(utils.createError('invalid token 2'))
    }
  }
})

const cocoRoute = require('./routes/coco')



app.use('/coco', cocoRoute)


app.listen(4003, () => {
    console.log(`Server running at http://localhost:4003`)
})