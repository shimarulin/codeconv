const { spawnCommand } = require('../runner/CommandRunner')
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
    spawnCommand(outDir, command, args),
    getMsg,
  )
}

module.exports = execute
