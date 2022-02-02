const bodyParser = require('body-parser')
const express = require('express')
const { Client } = require('pg')
const axios = require('axios')

module.exports = async () => {
  const app = express()
  const db = new Client()
  await db.connect()

  await db.query(
    'create table if not exists pets (id serial primary key, name varchar(255))'
  )

  app.use(bodyParser.json())

  app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  app.post('/pets', async (req, res) => {
    const pet = await db.query(
      'insert into pets (name) values ($1) returning *',
      [req.body.name]
    )

    res.send(pet)
  })

  app.get('/characters/:id', async (req, res) => {
    const { id } = req.params

    try {
      const result = await axios.get(`https://swapi.dev/api/people/${id}`)
      res.send(result.data)
    } catch(e) {
      res.status(500).send('Server error.')
    }
  })

  return {
    db,
    express: app,
    stop: () => db.end()
  }
}
