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
    author,
    email,
  },
) => {
  return {
    name,
    description,
    license,
    author: `${author} <${email}>`,
    private: when(type === 'Monorepo', true),
    scripts: {
      lint: when(type === 'Monorepo', 'lerna run lint --parallel --', 'eslint --ext js,md .'),
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
        'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
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
        // https://github.com/igorshubovych/markdownlint-cli/pull/80
        // 'markdownlint --fix',
        'eslint --fix',
      ],
      '**/*.json': [
        'prettier --write',
      ],
    }),
  }
}
