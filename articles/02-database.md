Sometimes, the code that we want to test reads or writes to a database.
In that case, we need a little more setup to be able to test the integration
with our database.

Lets pretend we have a endpoint that creates pets:

src/createApp.js:

```javascript
app.post('/pets', async (req, res) => {
  const pet = await pool.query(
    'insert into pets (name) values ($1) returning *',
    [req.body.name]
  )

  res.send(pet)
})
```

Firstly, we need to connect to the db and create our pets table:

src/createApp.js:

```javascript
const db = new Client()
await db.connect()

await db.query(
  'create table if not exists pets (id serial primary key, name varchar(255))'
)
```

We also need to use the json body parser, so we can send json objects
to our application:

src/createApp.js:

```javascript
app.use(bodyParser.json())
```

We finally, we are going to return a object so we can access the db connection,
express app and also stop our application:

src/createApp.js:

```javascript
return {
  db,
  express: app,
  stop: () => db.end()
}
```

Great! So, now, we are going to create our test case file. This file will
help us setting up things, so we don't need to repeat it every time.

test/appTestCase.js:

```javascript
const createApp = require('../src/createApp')

let app
beforeAll(async () => {
  app = await createApp()
  global.app = app
})

afterAll(async () => {
  await app.stop()
})
```

Now, we can require our test test case file:

test/app.test.js:

```javascript
require('./appTestCase')
```

And modify our test case to use our new application object:

test/app.test.js:

```javascript
it('should say hello world', async () => {
  await request(app.express)
    .get('/')
    .expect(200, 'Hello World!')
})
```

Finally, we can create the test for our pets endpoint:

test/app.test.js:

```javascript
it('should create pet', async () => {
  await request(app.express)
    .post('/pets')
    .send({ name: 'Fluffy' })
    .expect(200)

  const result = await app.db.query("select * from pets where name = 'Fluffy'")
  expect(result.rows.length).toBe(1)
})
```

And, as you expect, if we run `npx jest`, all the tests should successfully run.
But, if we run `npx jest` again, we should see something like:

```console
$ npx jest
 FAIL  test/app.test.js
  ✓ should say hello world (19 ms)
  ✕ should create pet (24 ms)

  ● should create pet

    expect(received).toBe(expected) // Object.is equality

    Expected: 1
    Received: 2

      16 |
      17 |   const result = await app.db.query("select * from pets where name = 'Fluffy'")
    > 18 |   expect(result.rows.length).toBe(1)
         |                              ^
      19 | })
      20 |
```

The problem here is that the db changes are persisted between each test run.
Ideally, we want to have totally isolation between tests. This means that
each test run, should receive a fresh copy of the database.
We can solve this issue in a couple of manners.

1. Delete and recreate the whole database between test runs.
   This can work, but as our application grows, it starts to get slow
   to delete and re-create the whole database (specially if we have lots
   of migrations).

2. Delete all rows from all tables between test runs.
   This can also work, but this maybe not straightforward like in case
   we have constraints, for example.

3. Run each test inside a transaction and rollback at the end.
   This is the approach I like most. It's what most of the backend frameworks do.
   It's fast and straightforward and requires little to no change to the code.

So, lets implement the third option:

test/appTestCase.js:

```javascript
beforeEach(async () => {
  await app.db.query('begin')
})

afterEach(async () => {
  await app.db.query('rollback')
})
```

Quick and simple! Now, if we delete and recreate out database, we should be able
to run out test suite multiple times, without issues:

```console
$ npx jest
 PASS  test/app.test.js
  ✓ should say hello world (21 ms)
  ✓ should create pet (19 ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        0.636 s, estimated 1 s
Ran all test suites.

$ npx jest
 PASS  test/app.test.js
  ✓ should say hello world (20 ms)
  ✓ should create pet (19 ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        0.61 s, estimated 1 s
Ran all test suites.
```