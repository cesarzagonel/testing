const c = require('../src/c')
const d = require('../src/d')

jest.mock('../src/d')

it('should call d', () => {
  c()

  expect(d).toHaveBeenCalled()
})
