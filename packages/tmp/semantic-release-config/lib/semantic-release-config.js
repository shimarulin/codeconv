const conventionalChangelogOptions = {
  preset: 'conventionalcommits',
  // https://github.com/conventional-changelog/conventional-changelog-config-spec/blob/master/versions/2.1.0/README.md
  presetConfig: {},
}

const changelogTitle =
`# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.`

const plugins = [
  [
    '@semantic-release/commit-analyzer',
    // https://github.com/semantic-release/commit-analyzer#options
    {
      ...conventionalChangelogOptions,
    },
  ],
  [
    '@semantic-release/release-notes-generator',
    // https://github.com/semantic-release/release-notes-generator#options
    {
      ...conventionalChangelogOptions,
    },
  ],
  [
    '@semantic-release/changelog',
    // https://github.com/semantic-release/changelog#options
    {
      changelogTitle,
    },
  ],
  // https://github.com/semantic-release/npm
  // Will skip if private === true
  '@semantic-release/npm',
  // https://github.com/semantic-release/git#options
  '@semantic-release/git',
]

module.exports = {
  branches: [
    'master',
  ],
  plugins,
}
