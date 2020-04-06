const { getWorkspace } = require('ultra-runner/lib/workspace')
const { findUp } = require('ultra-runner/lib/package')
const { getCurrentVersion } = require('./getCurrentVersion')
const { getReleaseType } = require('./getReleaseType')
const { resolveNextVersion } = require('./resolveNextVersion')
const { writeVersion } = require('./writeVersion')
const { writeChangelog } = require('./writeChangelog')
const { writeChangesToGit } = require('./writeChangesToGit')

const release = async () => {
  const root = findUp('package.json', process.cwd())
  const workspace = await getWorkspace({
    cwd: root,
  })
  const currentVersion = await getCurrentVersion()
  const releaseType = await getReleaseType(root)
  const nextVersion = resolveNextVersion(currentVersion, releaseType)

  const writeChangesToPkg = async (version, path) => {
    await writeVersion(version, path)
    await writeChangelog(path)
  }

  if (workspace.type === 'recursive' || workspace.type === 'single') {
    await writeChangesToPkg(nextVersion, workspace.root)
  } else {
    await Promise.all(
      Array
        .from(workspace.roots.keys())
        .map(path => writeChangesToPkg(nextVersion, path)),
    )
    await writeChangelog(workspace.root)
  }

  await writeChangesToGit(nextVersion)
}

module.exports = {
  release,
}
