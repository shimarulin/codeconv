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
  url,
) => {
  return {
    name,
    description,
    license,
    workspaces: when(type === 'Monorepo', [
      `packages/@${name}/*`,
    ]),
    version: when(type !== 'Monorepo', version),
    homepage: when(origin, url.homepage),
    bugs: when(origin, url.bugs),
    repository: when(origin, url.repository),
  }
}
