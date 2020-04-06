const gitSemverTags = require('git-semver-tags')
const semver = require('semver')

const getCurrentVersion = (initialVersion = '1.0.0') => {
  return new Promise((resolve, reject) => {
    gitSemverTags((err, tags) => {
      if (err) {
        return reject(err)
      }

      const gitVersion = [
        ...tags,
      ]
        .map(tag => semver.clean(tag))
        .sort(semver.rcompare)
        .shift()

      resolve(gitVersion || initialVersion)
    })
  })
}

module.exports = {
  getCurrentVersion,
}
