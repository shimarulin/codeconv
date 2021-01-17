const fs = require('fs')
const format = require('format-package')

const writeVersion = async (version, filePath, formatOptions) => {
  return new Promise((resolve, reject) => {
    const pkg = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    format({
      ...pkg,
      version,
    }, formatOptions)
      .then((pkgContent) => {
        fs.writeFile(filePath, pkgContent, 'utf8', (err) => {
          if (err) {
            return reject(err)
          }
          resolve()
        })
      })
  })
}

module.exports = {
  writeVersion,
}
