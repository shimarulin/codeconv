const conventionalRecommendedBump = require('conventional-recommended-bump')

const getReleaseType = (path = process.cwd(), preset = 'angular') => {
  return new Promise((resolve, reject) => {
    conventionalRecommendedBump({
      // For every package https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-recommended-bump#path
      path,
      preset,
    }, (error, recommendation) => {
      if (!error) {
        resolve(recommendation.releaseType)
      } else {
        reject(error)
      }
    })
  })
}

module.exports = {
  getReleaseType,
}
