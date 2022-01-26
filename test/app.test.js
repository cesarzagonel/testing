const request = require('supertest')

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
