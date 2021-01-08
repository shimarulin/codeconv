const gitSemverTags = require('git-semver-tags')
const semver = require('semver')

const getCurrentVersion = () => {
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

      resolve(gitVersion)
    })
  })
}

module.exports = {
  getCurrentVersion,
}
