const fs = require('fs')
const path = require('path')

let packageConfig = null
let lernaConfig = null

try {
  const packageConfigFilePath = path.resolve(process.cwd(), 'package.json')
  const hasPackageConfigFile = fs.statSync(packageConfigFilePath)
  packageConfig = hasPackageConfigFile && JSON.parse(fs.readFileSync(packageConfigFilePath))
} catch (e) {
  if (e.code === 'ENOENT') {
    process.env.DEBUG && console.log('Hasn\'t "package.json"')
  } else {
    console.dir(e)
  }
}

try {
  const lernaConfigFilePath = path.resolve(process.cwd(), 'lerna.json')
  const hasLernaConfigFile = fs.statSync(lernaConfigFilePath)
  lernaConfig = hasLernaConfigFile && JSON.parse(fs.readFileSync(lernaConfigFilePath))
} catch (e) {
  if (e.code === 'ENOENT') {
    process.env.DEBUG && console.log('Hasn\'t "lerna.json"')
  } else {
    console.dir(e)
  }
}

module.exports = {
  packageConfig,
  lernaConfig,
}
