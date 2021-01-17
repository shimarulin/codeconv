const semver = require('semver')

const resolveNextVersion = (initialVersion, currentVersion, releaseType) => {
  return currentVersion ? semver.inc(currentVersion, releaseType) : initialVersion
}

module.exports = {
  resolveNextVersion,
}
