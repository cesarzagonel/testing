const createApp = require('./src/createApp')

const app = createApp()
const port = 3000

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
