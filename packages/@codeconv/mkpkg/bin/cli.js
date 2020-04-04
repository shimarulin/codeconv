#!/usr/bin/env node
const path = require('path')
const cli = require('cac')()

cli
  .command('[directory]', 'Generate a new project to target directory. ' +
    'If you omit "directory",\n               new project will be generated in the current directory')
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

// cli
//   .command('add <feature>', 'Add a feature provided by mkpkg plugin')
//   .option(
//     '--log',
//     'Print actions log',
//   )
//   .action(async (feature, { log }) => {
//     console.log(feature, log)
//   })

cli.help()

cli.version(require('../package').version)

cli.parse()
