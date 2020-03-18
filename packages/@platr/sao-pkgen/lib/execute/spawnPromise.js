const spawn = require('cross-spawn')
const { lookpath } = require('lookpath')

const spawnPromise = (
  cwd = process.cwd(),
  command = 'echo',
  args = [],
) => {
  return new Promise((resolve) => {
    const succeedMessages = []
    const errorMessages = []
    lookpath(command)
      .then(() => {
        const childProcess = spawn(command, args, {
          cwd,
        })
        // console.log(childProcess)
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

module.exports = spawnPromise
