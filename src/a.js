const b = require('./b')

module.exports = function a () {
  const bResult = b()
  return `Hello from ${bResult}!`
}
