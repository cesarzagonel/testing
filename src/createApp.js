const bodyParser = require('body-parser')
const express = require('express')
const { Client } = require('pg')

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

  return {
    db,
    express: app,
    stop: () => db.end()
  }
}
