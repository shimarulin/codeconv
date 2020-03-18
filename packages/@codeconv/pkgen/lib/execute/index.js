const spawnPromise = require('./spawnPromise')
const printOut = require('./printOut')

function execute (
  outDir = process.cwd(),
  command = 'echo',
  args = [
    '',
  ],
  getMsg = (type) => `${command} ${type}`,
) {
  return printOut(
    spawnPromise(outDir, command, args),
    getMsg,
  )
}

module.exports = execute
