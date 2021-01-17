#!/usr/bin/env node

const path = require('path')
const project = path.join(__dirname, '../../tsconfig.json')
const yargs = require('yargs')

require('ts-node').register({
  project,
})

// process.send('Test case')

yargs
  .command(require('../../src'))
  .parse()
