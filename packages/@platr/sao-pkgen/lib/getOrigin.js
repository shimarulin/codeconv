const { parseRepositoryUrl } = require('./parseRepositoryUrl')
const getOrigin = (url) => {
  const { host, owner, project } = parseRepositoryUrl(url)
  return `git@${host}:${owner}/${project}.git`
}

module.exports = getOrigin
