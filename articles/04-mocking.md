On the last part of this series of articles, we were introduced to the concept of _mocking_.
It turns out that we can also mock javascript functions as we are going to see.
Let's say that we have function _A_ that happens to call function _B_ but we don't want
to actually call function _B_ while testing _A_. How can we get around this? Mocking is
the answer! Let's say we have the following situation:

src/a.js:

```javascript
const b = require('./b')

module.exports = function a () {
  const bResult = b()
  return `Hello from ${bResult}!`
}
```

src/b.js:

```javascript
module.exports = function b () {
  return 'earth'
}
```

tests/a.test.js:

```javascript
const a = require('../src/a')

it('should say "Hello from jupyter!"', () => {
  expect(a()).toBe('Hello from jupyter!')
})
```

As you would expect, if we run the tests, we are going to see a test failing:

```console
$ npx jest test/a.test.js
 FAIL  test/a.test.js
  ✕ should say "Hello from jupyter!" (3 ms)

  ● should say "Hello from jupyter!"

    expect(received).toBe(expected) // Object.is equality

    Expected: "Hello from jupyter!"
    Received: "Hello from earth!"

      2 |
      3 | it('should say "Hello from jupyter!"', () => {
    > 4 |   expect(a()).toBe('Hello from jupyter!')
        |               ^
      5 | })
      6 |

      at Object.<anonymous> (test/a.test.js:4:15)
```

To fix this, we are going to use a jest method called `mock`, like this:

```javascript
const a = require('../src/a')
const b = require('../src/b')

jest.mock('../src/b')

it('should say "Hello from jupyter!"', () => {
  b.mockReturnValue('jupyter')

  expect(a()).toBe('Hello from jupyter!')
})
```

Let's breakdown what's going on. First, we import `b`, so we can interact with it.
Then, we call `jest.mock` and pass `b` path as parameter. This will intercept all requires
to `b` and return a jest mock instance instead. This mock instance, have special methods
we can call, like `mockReturnValue`. And finally, `b.mockReturnValue` makes every call to
`b` return `jupyter`.

Another useful thing we can do with mocks is assert if they have been called. Let's assume
the following scenario:

src/c.js

```javascript
const d = require('./d')

module.exports = function c () {
  d()
  return 'function d have been called'
}
```

But, how can we make sure that function `d` have been called? Mocks can help us with that too!

test/c.test.js

```javascript
const c = require('../src/c')
const d = require('../src/d')

jest.mock('../src/d')

it('should call d', () => {
  c()

  expect(d).toHaveBeenCalled()
})
```

As you expect, `toHaveBeenCalled` verifies if the mock `d` have been called. If we run the tests,
we should see all tests passing:

```console
$ npx jest test/c.test.js
 PASS  test/c.test.js
  ✓ should call d (1 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.132 s
```

Another useful verification function is `toHaveBeenCalledWith(arg1, arg2, ...)` which checks if the function
has been called with given arguments.
You can see all the verification functions jest have [here](https://jestjs.io/docs/expect).
