const createApp = require('../src/createApp')

let app
beforeAll(async () => {
  app = await createApp()
  global.app = app
})

beforeEach(async () => {
  await app.db.query('begin')
})

afterEach(async () => {
  await app.db.query('rollback')
})

afterAll(async () => {
  await app.stop()
})
