const path = require('path')
const { getWorkspace } = require('ultra-runner/lib/workspace')
const { findUp } = require('ultra-runner/lib/package')
const { getCurrentVersion } = require('./getCurrentVersion')
const { getReleaseType } = require('./getReleaseType')
const { resolveNextVersion } = require('./resolveNextVersion')
const { writeVersion } = require('./writeVersion')
const { writeChangelog } = require('./writeChangelog')
const { writeChangesToGit } = require('./writeChangesToGit')

const manifestFileName = 'package.json'
const changelogFileName = 'CHANGELOG.md'

const release = async () => {
  const root = findUp('package.json', process.cwd())
  const workspace = await getWorkspace({
    cwd: root,
  })
  const currentVersion = await getCurrentVersion()
  const releaseType = await getReleaseType(root)
  const nextVersion = resolveNextVersion(currentVersion, releaseType)

  const writeChangesToFs = async (version, directory) => {
    await writeVersion(version, path.resolve(directory, manifestFileName))
    await writeChangelog(path.resolve(directory, changelogFileName))
  }

  if (workspace.type === 'recursive' || workspace.type === 'single') {
    await writeChangesToFs(nextVersion, workspace.root)
  } else {
    await Promise.all(
      Array
        .from(workspace.roots.keys())
        .map(directory => writeChangesToFs(nextVersion, directory)),
    )
    await writeChangelog(path.resolve(workspace.root, changelogFileName))
  }

  await writeChangesToGit(nextVersion)
}

module.exports = {
  release,
}
