const fs = require('fs')
const path = require('path')

const defaultPackageName = 'package.json'
const defaultPackagePath = path.resolve(process.cwd(), defaultPackageName)

const findPkg = (packagePath) => {
  try {
    fs.accessSync(packagePath, fs.constants.R_OK)
    return packagePath
  } catch (err) {
    const upPackagePath = path.resolve(path.resolve(path.dirname(packagePath), '..'), path.basename(packagePath))
    return upPackagePath !== packagePath ? findPkg(upPackagePath) : false
  }
}
const checkEslintConfigTypescript = (pkgPath) => {
  if (pkgPath) {
    const pkg = require(pkgPath)
    return 'devDependencies' in pkg && '@codeconv/eslint-config-typescript' in pkg.devDependencies
  } else {
    return false
  }
}

module.exports = checkEslintConfigTypescript(findPkg(defaultPackagePath))
