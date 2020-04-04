#!/usr/bin/env node
const path = require('path')
const cli = require('cac')()

cli
  .command('[target-directory]', 'Generate a new project to target directory')
  .option(
    '--log',
    'Print actions log',
  )
  .action(async (targetDirectory = process.cwd(), { log }) => {
    const sao = require('sao')

    const app = sao({
      generator: path.join(__dirname, '..'),
      outDir: targetDirectory,
      quiet: !log,
    })

    await app.run().catch(sao.handleError)
  })

cli.help()

cli.version(require('../package').version)

cli.parse()
