const express = require('express')
const cors = require('cors')
const app = express()
const http = require('http')
require('dotenv').config()
const localPort = process.env.LOCALPORT
app.use(cors())
http.createServer(app).listen(localPort)
app.get('/', function (req, res) {
  return res.send(`Hello! The API is running at ${localPort}`)
})
app.use(express.urlencoded({ extended: false }))
app.use(express.json())



