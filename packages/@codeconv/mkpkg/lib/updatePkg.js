const { parseRepositoryUrl } = require('./parseRepositoryUrl')
const { getHomepage, getBugs, getRepository } = require('./generatePackageUrls')
const when = (condition, value, fallback) => (condition ? value : fallback)

module.exports = (
  data,
  {
    type,
    name,
    description,
    license,
    version,
    origin,
    directory,
  },
) => {
  const urlParts = parseRepositoryUrl(origin)
  return {
    name,
    description,
    license,
    workspaces: when(type === 'Monorepo', [
      `packages/@${name}/*`,
    ]),
    version: when(type !== 'Monorepo', version),
    homepage: when(origin, getHomepage(urlParts, directory)),
    bugs: when(origin, getBugs(urlParts)),
    repository: when(origin, getRepository(urlParts, directory)),
  }
}
