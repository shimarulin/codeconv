const path = require('path')
const fs = require('fs')
const conventionalChangelog = require('conventional-changelog')
const addStream = require('add-stream')
const tempfile = require('tempfile')
const replaceStream = require('replacestream')

const writeChangelog = async (directory, fileName, config, version, changelogTitle, full = false) => {
  const filePath = path.resolve(directory, fileName)
  const options = {
    config,
    pkg: {
      path: directory,
    },
  }
  const context = {
    version,
  }
  const gitRawCommitsOpts = {
    path: directory,
  }
  const parserOpts = {}
  const writerOpts = {}

  return new Promise((resolve) => {
    const createFile = () => {
      const outStream = fs.createWriteStream(filePath)
      outStream.write(changelogTitle, 'utf-8')

      const changelogStream = conventionalChangelog({
        ...options,
        releaseCount: 0,
      }, context, gitRawCommitsOpts, parserOpts, writerOpts)
      changelogStream
        .pipe(outStream)
        .on('finish', () => {
          resolve()
        })
    }

    const appendToFile = () => {
      const changelogStream = conventionalChangelog({
        ...options,
        releaseCount: 1,
      }, context, gitRawCommitsOpts, parserOpts, writerOpts)

      const readStream = fs.createReadStream(filePath)

      const tmp = tempfile()
      const tmpWriteStream = fs.createWriteStream(tmp)

      changelogStream
        .pipe(addStream(readStream))
        .pipe(replaceStream(changelogTitle, ''))
        .pipe(tmpWriteStream)
        .on('finish', function () {
          const outStream = fs.createWriteStream(filePath)
          outStream
            .write(changelogTitle, 'utf-8')
          outStream
            .on('finish', () => {
              resolve()
            })
          fs.createReadStream(tmp)
            .pipe(outStream)
        })
    }

    fs.access(filePath, (err) => {
      if (err || full) {
        createFile()
      } else {
        appendToFile()
      }
    })
  })
}

module.exports = {
  writeChangelog,
}
