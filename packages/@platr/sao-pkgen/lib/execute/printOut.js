const ora = require('ora')

const printOut = (
  spawnPromise,
  getMsg = (type, code, messages) => (code ? `${type}> Exit code: ${code}, Messages: ${messages.join('\n    ')}` : type),
) => {
  const spinner = ora(getMsg('started')).start()
  return new Promise((resolve) => {
    spawnPromise
      .then(({ code, messages }) => {
        if (code === 0) {
          spinner.succeed(getMsg('succeed', code, messages))
        } else {
          spinner.fail(getMsg('failed', code, messages))
        }
        resolve({
          code,
          messages,
        })
      })
  })
}

module.exports = printOut
