const path = require('path')
const { getWorkspace } = require('ultra-runner/lib/workspace')
const { findUp } = require('ultra-runner/lib/package')
const { getCurrentVersion } = require('./getCurrentVersion')
const { getReleaseType } = require('./getReleaseType')
const { resolveNextVersion } = require('./resolveNextVersion')
const { writeVersion } = require('./writeVersion')
const { writeChangelog } = require('./writeChangelog')
const { writeChangesToGit } = require('./writeChangesToGit')

const defaults = {
  manifestFileName: 'package.json',
  manifestFormatOptions: {},
  changelogFileName: 'CHANGELOG.md',
  initialVersion: '1.0.0',
  preset: 'angular',
}

const config = {
  ...defaults,
}

const release = async () => {
  const root = findUp(config.manifestFileName, process.cwd())
  const workspace = await getWorkspace({
    cwd: root,
  })
  const currentVersion = await getCurrentVersion(config.initialVersion)
  const releaseType = await getReleaseType(root, config.preset)
  const nextVersion = resolveNextVersion(currentVersion, releaseType)

  const writeChangesToFs = async (version, directory) => {
    await writeVersion(version, path.resolve(directory, config.manifestFileName), config.manifestFormatOptions)
    await writeChangelog(directory, config.changelogFileName, config.preset, nextVersion)
  }

  if (workspace.type === 'recursive' || workspace.type === 'single') {
    await writeChangesToFs(nextVersion, workspace.root)
  } else {
    await Promise.all(
      Array
        .from(workspace.roots.keys())
        .map(directory => writeChangesToFs(nextVersion, directory)),
    )
    await writeChangelog(workspace.root, config.changelogFileName, config.preset, nextVersion)
  }

  await writeChangesToGit(nextVersion)
}

module.exports = {
  release,
}
