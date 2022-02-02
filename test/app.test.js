const axios = require('axios')
const request = require('supertest')
const MockAdapter = require('axios-mock-adapter')

require('./appTestCase')

it('should say hello world', async () => {
  await request(app.express)
    .get('/')
    .expect(200, 'Hello World!')
})

it('should create pet', async () => {
  await request(app.express)
    .post('/pets')
    .send({ name: 'Fluffy' })
    .expect(200)

  const result = await app.db.query("select * from pets where name = 'Fluffy'")
  expect(result.rows.length).toBe(1)
})

it('should fetch character', async () => {
  const mock = new MockAdapter(axios)

  mock.onGet('https://swapi.dev/api/people/1').reply(200, {
    name: 'Luke Skywalker',
    height: '172',
    mass: '77',
    hair_color: 'blond',
    skin_color: 'fair',
    eye_color: 'blue',
    birth_year: '19BBY',
    gender: 'male'
  })

  const response = await request(app.express)
    .get('/characters/1')
    .expect(200)

  expect(response.body).toMatchObject({
    name: 'Luke Skywalker',
    height: '172',
    mass: '77',
    hair_color: 'blond',
    skin_color: 'fair',
    eye_color: 'blue',
    birth_year: '19BBY',
    gender: 'male'
  })
})
