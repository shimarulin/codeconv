const spawn = require('cross-spawn')
const { lookpath } = require('lookpath')
const ora = require('ora')
const chalk = require('chalk')

const style = {
  system: chalk.blackBright,
  command: chalk.yellow,
  args: chalk.magenta,
}
const getText = (cmd = '', messages = []) => {
  const args = parseCommand(cmd)
  const command = args.shift()

  const message = messages
    .map((msg, idx, arr) => `  ${style.system('│')} ${msg}${idx === arr.length - 1 ? '' : '\n'}`)
    .join('')
  return `${style.system('$')} ${style.command(command)} ${style.args(args.join(' '))}${messages.length > 0 ? '\n' : ''}${message}`
}
const parseMessage = (message = '') => message.split('\n').map(msg => msg.trim())
const parseCommand = (cmd = '') => {
  const reducer = (accumulator, currentValue) => {
    const argList = []
    if (typeof accumulator === 'string') {
      argList.push(accumulator)
    } else {
      argList.push(...accumulator)
    }
    const lastArg = accumulator[accumulator.length - 1]
    const bodyQuote = lastArg.search(/^"/) !== -1
    const endQuote = lastArg.search(/"$/) !== -1
    if (bodyQuote && !endQuote) {
      argList[argList.length - 1] = lastArg + ' ' + currentValue
    } else {
      argList.push(currentValue)
    }

    return argList
  }

  return cmd
    .split(' ')
    .map(item => item.trim())
    .reduce(reducer)
    .map(item => item.replace(/"/g, ''))
}

class CommandRunner {
  constructor (cwd = process.cwd()) {
    this.cwd = cwd
  }

  async run (cmd) {
    const spinner = ora(getText(cmd)).start()
    return this.spawn(cmd, spinner)
  }

  async spawn (cmd, spinner) {
    const args = parseCommand(cmd)
    const command = args.shift()
    const { cwd } = this

    return new Promise((resolve, reject) => {
      const succeedMessages = []
      const errorMessages = []
      lookpath(command)
        .then(() => {
          const childProcess = spawn(command, args, {
            cwd,
          })
          childProcess.stdout.on('data', (msg) => {
            succeedMessages.push(...parseMessage(msg.toString().trim()))
            spinner && (spinner.text = getText(cmd, succeedMessages))
          })
          childProcess.stderr.on('data', (msg) => {
            errorMessages.push(...parseMessage(msg.toString().trim()))
          })
          childProcess.on('exit', (code) => {
            if (code === 0) {
              spinner && spinner.succeed(getText(cmd, succeedMessages))
              resolve({
                code,
                messages: succeedMessages,
              })
            } else {
              // eslint-disable-next-line prefer-promise-reject-errors
              spinner && spinner.fail(getText(cmd, errorMessages))
              reject(new Error(`exit code ${code}`))
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
}

module.exports = {
  CommandRunner,
  getText,
  parseCommand,
  parseMessage,
}
