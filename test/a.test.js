const a = require('../src/a')
const b = require('../src/b')

jest.mock('../src/b')

it('should say "Hello from jupyter!"', () => {
  b.mockReturnValue('jupyter')

  expect(a()).toBe('Hello from jupyter!')
})
