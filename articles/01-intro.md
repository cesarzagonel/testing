We are going to start with this pretty basic `hello world` application:

index.js:

```javascript
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
```

package.json:

```json
{
  "name": "testing",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "dependencies": {
    "express": "^4.17.2"
  },
  "scripts": {
    "start": "node index.js"
  }
}
```

For the test framework, we are going to use Jest. So, let's install it
using the command:

```shell
npm install jest ---save-dev
```

And now, we can write our first test:

test/app.test.js:

```javascript
it('should say hello world', () => {
  console.log('Hello World!')
})
```

And now we can finally run our first test using the command:

```shell
npx jest
```

You should see something similar on the terminal, if everything run smoothly:

```
➜  npx jest
  console.log
    Hello World!

      at Object.<anonymous> (test/app.test.js:2:11)

 PASS  ./test/app.test.js
  ✓ should say hello world (18 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.302 s, estimated 1 s
Ran all test suites.
```

To actually send requests to out express application, we are going
to use supertest. Supertest provide us lots of functions to make our life easier.
Let's go ahead and install it using:

```shell
npm install supertest --save-dev
```

In order to test our application, we need to move some of the express app
creation logic into a file we can we can import from the test file:

index.js:

```javascript
const createApp = require('./src/createApp')

const app = createApp()
const port = 3000

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
```

src/createApp.js:

```javascript
const express = require('express')

module.exports = () => {
  const app = express()
  
  app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  return app
}
```

Now that we have all set, we can test our Hello World endpoint:

test/app.test.js:

```javascript
const request = require('supertest')
const createApp = require('../src/createApp')

it('should say hello world', async () => {
  await request(createApp())
    .get('/')
    .expect(200, 'Hello World!')
})
```

If everything went well, you should see something like this on the terminal:

```bash
➜  testing npx jest
 PASS  ./test/app.test.js
  ✓ should say hello world (31 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.726 s, estimated 1 s
Ran all test suites.
```

That's it! We successfully ran our first express test.
Before we finish this first part, lets break down what is happening:

```javascript
await request(createApp())
```

Here, we create a instance of out app and pass it to supertest.
Supertest does all the heavy work of binding our application to
a specific port and make sure each request goes to the right place.

```javascript
.get('/')
```

Here, we tell supertest to send a `GET` request to the `/` path.

```javascript
.expect(200, 'Hello World!')
```

And finally, here we make sure that the response status is `200` and
the body is exacly `Hello World!`.

Supertest is very helpful library, it allows us to verify different behaviours of our
application like:

The endpoint should return a 500 error:

```javascript
.expect(500)
```

The endpoint should return a object:

```javascript
.expect(200, {
  lorem: 'ipsum'
})
```

And many others. You can know more about supertest [here](https://www.npmjs.com/package/supertest).
