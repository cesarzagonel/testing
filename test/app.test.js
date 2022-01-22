const request = require('supertest')
const createApp = require('../src/createApp')

it('should say hello world', async () => {
  await request(createApp())
    .get('/')
    .expect(200, 'Hello World!')
})
