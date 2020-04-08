#!/usr/bin/env node
const cli = require('cac')()
const { release } = require('../lib/release')

cli
  .option(
    '--full',
    'Generate full changelog and replace existing changelog file(s)',
  )

cli.help()

cli.version(require('../package').version)

release(cli.parse())
  .catch((e) => {
    throw e
  })
