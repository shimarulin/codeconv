const semver = require('semver')

const resolveNextVersion = (currentVersion, releaseType) => {
  return semver.inc(currentVersion, releaseType)
}

module.exports = {
  resolveNextVersion,
}
