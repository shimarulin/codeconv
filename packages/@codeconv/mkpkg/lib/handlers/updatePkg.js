const { when } = require('./conditions')

module.exports = (
  data,
  {
    type,
    name,
    description,
    license,
    version,
    url,
    isNewProject,
    isPrivate,
    typescript,
  },
) => {
  return {
    name,
    description,
    license,
    private: when(type === 'Monorepo' || isPrivate, true),
    scripts: {
      lint: when(type === 'Monorepo', 'lerna run lint --parallel --', `eslint --ext .js${typescript ? ',.ts' : ''} .`),
      release: when(isNewProject, when(type === 'Monorepo', 'lerna publish', '')),
    },
    workspaces: when(type === 'Monorepo', [
      `packages/@${name}/*`,
    ]),
    version: when(type !== 'Monorepo', version),
    homepage: when(url.urlSource, url.homepage),
    bugs: when(url.urlSource, url.bugs),
    repository: when(url.urlSource, url.repository),
    husky: when(isNewProject, {
      hooks: {
        'pre-commit': 'lint-staged',
        'post-commit': 'git update-index -g',
      },
    }),
    'lint-staged': when(isNewProject, {
      '**/*.{js,ts}': [
        'eslint --fix',
      ],
      '**/package.json': [
        'prettier --write',
        'format-package --write',
      ],
      '**/*.md': [
        'prettier --write',
      ],
      '**/*.json': [
        'prettier --write',
      ],
    }),
  }
}
