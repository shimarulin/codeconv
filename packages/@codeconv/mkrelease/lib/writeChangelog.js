const path = require('path')
const fs = require('fs')
const conventionalChangelog = require('conventional-changelog')

const writeChangelog = async (directory, fileName, preset, version) => {
  const filePath = path.resolve(directory, fileName)
  const options = {
    preset,
    pkg: {
      path: directory,
    },
    releaseCount: 0,
  }
  const context = {
    version,
  }
  const gitRawCommitsOpts = {
    path: directory,
  }
  const parserOpts = {}
  const writerOpts = {}

  const changelogStream = conventionalChangelog(options, context, gitRawCommitsOpts, parserOpts, writerOpts)
  const outStream = fs.createWriteStream(filePath)
  changelogStream
    .pipe(outStream)
}

module.exports = {
  writeChangelog,
}
