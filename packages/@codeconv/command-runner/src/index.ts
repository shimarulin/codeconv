import * as execa from 'execa'
import { ExecaReturnValue } from 'execa'
import * as ora from 'ora'
import { blackBright, blueBright, cyan, green, yellow } from 'chalk'

const style = {
  system: blackBright,
  command: green,
  args: yellow,
  info: cyan,
  time: blueBright,
}

const getStdOut = (file: string, args: string[], messages: string[] = [], time = 0): string => {
  const timeRow = `\n  ${style.system('└')} ${style.info('Done in')} ${style.time(`${Math.floor(time / 10) / 100}s`)}`

  const message = messages
    .map((msg, idx, arr) => `  ${style.system('│')} ${msg}${idx === arr.length - 1 ? '' : '\n'}`)
    .join('')
  return `${style.system('$')} ${style.command(file)} ${style.args(args.join(' '))}${messages.length > 0 ? '\n' : ''}${message}${time !== 0 ? timeRow : ''}`
}

const parseMessage = (message = ''): string[] => message.split('\n').map(msg => msg.trim())

const parseCommand = (cmd = ''): string[] => {
  const reducer = (accumulator: string[], currentValue: string): string[] => {
    const argList = []
    argList.push(...accumulator)

    const lastArg = argList.length > 1 ? accumulator[accumulator.length - 1] : ''
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
    .reduce(reducer, [])
    .map((item: string) => item.replace(/"/g, ''))
}

export class CommandRunner {
  private readonly cwd: string;

  constructor (cwd: string) {
    this.cwd = cwd
  }

  async exec (command: string): Promise<ExecaReturnValue> {
    const args = parseCommand(command)
    const _command = args.shift()

    if (!_command) {
      throw new Error(`Invalid command: ${command}`)
    }

    return this.spawn(_command, args)
  }

  async spawn (command: string, args: string[] = []): Promise<ExecaReturnValue> {
    const dateStart = new Date()
    const succeedMessages: string[] = []
    const errorMessages: string[] = []
    const printStdOut = getStdOut.bind(null, command, args)
    const { cwd } = this
    const spinner = ora(printStdOut()).start()

    const childProcess = execa(command, args, {
      cwd,
    })

    // eslint-disable-next-line no-unused-expressions
    childProcess.stdout?.on('data', (msg) => {
      succeedMessages.push(...parseMessage(msg.toString().trim()))
      spinner.text = printStdOut(succeedMessages)
    })

    // eslint-disable-next-line no-unused-expressions
    childProcess.stderr?.on('data', (msg) => {
      errorMessages.push(...parseMessage(msg.toString().trim()))
    })

    childProcess.on('exit', (code) => {
      if (code === 0) {
        const time: number = new Date().getTime() - dateStart.getTime()
        spinner.succeed(printStdOut(succeedMessages, time))
      } else {
        spinner.fail(printStdOut(errorMessages))
      }
    })

    return childProcess
  }
}
