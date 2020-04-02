const spawn = require('cross-spawn')
const { lookpath } = require('lookpath')
const ultra = require('ultra-runner')
const { CommandParser } = require('ultra-runner/lib/parser')
const { Runner, getPackage, findUp } = ultra

class CommandRunner extends Runner {
  constructor (options, cwd) {
    super(options)
    this.cwd = cwd
  }

  async run (cmd, pkg, cwd = this.cwd) {
    if (!pkg) {
      const root = findUp('package.json', cwd)
      if (root) pkg = getPackage(root)
    }
    if (pkg) {
      const parser = new CommandParser(pkg)
      const command = parser.parse(cmd).setCwd(cwd)
      return this._run(command)
    }
    throw new Error('Could not find package')
  }
}

async function runCommand (cwd, cmd, options) {
  const runner = new CommandRunner(options, cwd)
  return runner.run(cmd)
}

async function spawnCommand (
  cwd = process.cwd(),
  command = 'echo',
  args = [
    '',
  ],
) {
  return new Promise((resolve) => {
    const succeedMessages = []
    const errorMessages = []
    lookpath(command)
      .then(() => {
        const childProcess = spawn(command, args, {
          cwd,
        })
        childProcess.stdout.on('data', (msg) => {
          succeedMessages.push(msg.toString().replace(/\n$/, ''))
        })
        childProcess.stderr.on('data', (msg) => {
          errorMessages.push(msg.toString().replace(/\n$/, ''))
        })
        childProcess.on('exit', (code) => {
          if (code === 0) {
            resolve({
              code,
              messages: succeedMessages,
            })
          } else {
            // eslint-disable-next-line prefer-promise-reject-errors
            resolve({
              code,
              messages: errorMessages,
            })
          }
        })
      })
      .catch(() => {
        errorMessages.push(`Command '${command}' not found in your PATH. Please install '${command}' and try again.`)
        // eslint-disable-next-line prefer-promise-reject-errors
        resolve({
          command,
          code: -1,
          messages: errorMessages,
        })
      })
  })
}

module.exports = {
  CommandRunner,
  runCommand,
  spawnCommand,
}
