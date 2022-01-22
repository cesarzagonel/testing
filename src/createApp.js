const express = require('express')
const app = express()

module.exports = () => {
  app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  return app
}
