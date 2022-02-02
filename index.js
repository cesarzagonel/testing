const createApp = require('./src/createApp')

const port = 3000

createApp().then(app => {
  app.express.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
})
