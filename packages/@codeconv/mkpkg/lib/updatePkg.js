const when = (condition, value, fallback) => (condition ? value : fallback)

module.exports = (
  data,
  {
    type,
    name,
    description,
    license,
    version,
    url,
  },
) => {
  return {
    name,
    description,
    license,
    workspaces: when(type === 'Monorepo', [
      `packages/@${name}/*`,
    ]),
    version: when(type !== 'Monorepo', version),
    homepage: when(url.urlSource, url.homepage),
    bugs: when(url.urlSource, url.bugs),
    repository: when(url.urlSource, url.repository),
  }
}
