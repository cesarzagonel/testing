Often we need to test a piece of code that access a third party service. In that case, we dont want to
depend on a third party service being online so we can run our tests. Even if the third party service
is online, we still don't want to rely on it because our inernet connection maybe slow or the
service maybe not fast enough for testing porposes. Also, we always want our tests to run as fast as
possible so we don't disencourage our developers to run the tests constantly. For all those purposes,
we have a perfect tool: mocking. 

Image that we have an endpoint on our application that fetches Star Wars characters like this:

```javascript
app.get('/characters/:id', async (req, res) => {
  const { id } = req.params
  const result = await axios.get(`https://swapi.dev/api/people/${id}`)
  res.send(result.data)
})
```

And, the respective test like this:

```javascript
it('should fetch character', async () => {
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
```

So far so good. But, let's pretend that we got no internet, let's try running our tests:

```console
$ npx jest    
 FAIL  test/app.test.js
  ✓ should say hello world (19 ms)
  ✓ should create pet (23 ms)
  ✕ should fetch character (20 ms)

  ● should fetch character

    expected 200 "OK", got 500 "Internal Server Error"

      22 |   const response = await request(app.express)
      23 |     .get('/characters/1')
    > 24 |     .expect(200)
         |      ^
      25 |
      26 |   expect(response.body).toMatchObject({
      27 |     name: 'Luke Skywalker',

      at Object.<anonymous> (test/app.test.js:24:6)
      ...
```

As expect, we were unnable to run our tests. Luckly, we can get around this.
The `axios-mock-adapter` helps us _mock_ responses. Mocking is basically replicating an
specifig behavior. So, by mocking the response, we are replicating the third party service
behaviour. Let's see how it looks like moking a request using `axios-mock-adapter`.

```javascript
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
```

And, if we try to run our tests again, we should see all them succeeding, even if 
we have no internet or the service is unavailable:

```console
$ npx jest
 PASS  test/app.test.js
  ✓ should say hello world (10 ms)
  ✓ should create pet (13 ms)
  ✓ should fetch character (3 ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        0.338 s, estimated 1 s
Ran all test suites.
```