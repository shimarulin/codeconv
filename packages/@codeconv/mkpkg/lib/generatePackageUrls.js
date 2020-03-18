const hasSubDir = (dirPath = '') => dirPath.split('/').length > 1

const getHomepage = ({ host, owner, project }, dir = '') => {
  const projectPathPrefix = (host === 'github.com' && '/tree/master') ||
    (host === 'gitlab.com' && '/-/tree/master') ||
    (host === 'bitbucket.org' && '/src/master') ||
    '/-/tree/master'
  const projectPath = hasSubDir(dir)
    ? `${projectPathPrefix}/${dir}`
    : ''
  const readmeHash = host === 'github.com' ? '#readme' : ''
  return `https://${host}/${owner}/${project}${projectPath}${readmeHash}`
}

const getBugs = ({ host, owner, project }) => {
  return {
    url: `https://${host}/${owner}/${project}/issues`,
  }
}

const getRepository = ({ host, owner, project }, dir = '') => {
  return {
    type: 'git',
    url: `https://${host}/${owner}/${project}.git`,
    directory: hasSubDir(dir) ? dir : undefined,
  }
}

module.exports = {
  hasSubDir,
  getHomepage,
  getBugs,
  getRepository,
}
