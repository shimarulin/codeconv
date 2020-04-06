const gitSemverTags = require('git-semver-tags')
const semver = require('semver')

const getCurrentVersion = (initialVersion = '1.0.0') => {
  return new Promise((resolve, reject) => {
    gitSemverTags((err, tags) => {
      if (err) {
        reject(err)
      }

      const gitVersion = [
        ...tags,
      ].shift()

      resolve(semver.clean(gitVersion || initialVersion))
    })
  })
}

module.exports = {
  getCurrentVersion,
}
