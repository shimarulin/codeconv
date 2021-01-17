const path = require('path')
const { getWorkspace } = require('ultra-runner/lib/workspace')
const { findUp } = require('ultra-runner/lib/package')
const { getCurrentVersion } = require('./getCurrentVersion')
const { getReleaseType } = require('./getReleaseType')
const { resolveNextVersion } = require('./resolveNextVersion')
const { writeVersion } = require('./writeVersion')
const { writeChangelog } = require('./writeChangelog')
const { writeChangesToGit } = require('./writeChangesToGit')

const changelogTitle =
  `# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.\n\n`

const defaults = {
  manifestFileName: 'package.json',
  manifestFormatOptions: {},
  changelogFileName: 'CHANGELOG.md',
  initialVersion: '1.0.0',
  changelogTitle,
}

const config = {
  ...defaults,
}

const release = async ({ options: { full } }) => {
  const cfg = await require('@codeconv/conventional-changelog-codeconv')({
    types: [
      {
        type: 'feat',
        section: 'Features',
      },
      {
        type: 'fix',
        section: 'Bug Fixes',
      },
      {
        type: 'perf',
        section: 'Performance Improvements',
      },
      {
        type: 'revert',
        section: 'Reverts',
      },
      {
        type: 'docs',
        section: 'Documentation',
        hidden: true,
      },
      {
        type: 'style',
        section: 'Styles',
        hidden: true,
      },
      {
        type: 'chore',
        section: 'Miscellaneous Chores',
        hidden: false,
      },
      {
        type: 'refactor',
        section: 'Code Refactoring',
        hidden: true,
      },
      {
        type: 'test',
        section: 'Tests',
        hidden: true,
      },
      {
        type: 'build',
        section: 'Build System',
        hidden: true,
      },
      {
        type: 'ci',
        section: 'Continuous Integration',
        hidden: true,
      },
    ],
  })

  const root = findUp(config.manifestFileName, process.cwd())
  const workspace = await getWorkspace({
    cwd: root,
  })
  const currentVersion = await getCurrentVersion(config.initialVersion)
  const releaseType = await getReleaseType(root, cfg)
  const nextVersion = resolveNextVersion(config.initialVersion, currentVersion, releaseType)

  const writeChangesToFs = async (version, directory) => {
    await writeVersion(version, path.resolve(directory, config.manifestFileName), config.manifestFormatOptions)
    await writeChangelog(directory, config.changelogFileName, cfg, nextVersion, config.changelogTitle, full)
  }

  if (workspace.type === 'recursive' || workspace.type === 'single') {
    await writeChangesToFs(nextVersion, workspace.root)
  } else {
    await Promise.all(
      Array
        .from(workspace.roots.keys())
        .map(directory => writeChangesToFs(nextVersion, directory)),
    )
    await writeChangelog(workspace.root, config.changelogFileName, cfg, nextVersion, config.changelogTitle, full)
  }

  await writeChangesToGit(nextVersion)
}

module.exports = {
  release,
}
