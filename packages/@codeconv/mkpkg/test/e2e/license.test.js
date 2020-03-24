const path = require('path')
const fs = require('fs')
const sao = require('sao')
const generator = path.join(__dirname, '../..')
const { readJsonFile } = require('../helpers/readJsonFile')

describe('License', () => {
  describe('Use default values', () => {
    let helper

    beforeAll(async () => {
      helper = await sao.mock({
        generator,
      })
      return true
    })

    test('License file', async () => {
      const expected = fs.readFileSync(path.resolve(__dirname, '../fixtures/LICENSE-MIT.ejs'))
        .toString()
        .replace('<%- year %>', new Date().getFullYear().toString(10))
      const license = await helper.readFile('LICENSE')

      expect(license).toEqual(expected)
    })

    test('License field in "package.json"', async () => {
      const pkg = await readJsonFile(helper)

      expect(pkg.license).toEqual('MIT')
    })
  })

  describe('Select "Apache 2.0" license', () => {
    let helper

    beforeAll(async () => {
      helper = await sao.mock({
        generator,
      },
      {
        license: 'Apache-2.0',
      })
      return true
    })

    test('License file', async () => {
      const expected = fs.readFileSync(path.resolve(__dirname, '../fixtures/LICENSE-Apache-2.0.ejs'))
        .toString()
        .replace('<%- year %>', new Date().getFullYear().toString(10))
      const license = await helper.readFile('LICENSE')

      expect(license).toEqual(expected)
    })

    test('License field in "package.json"', async () => {
      const pkg = await readJsonFile(helper)

      expect(pkg.license).toEqual('Apache-2.0')
    })
  })
})
