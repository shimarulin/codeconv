const path = require('path')
const fs = require('fs')
const sao = require('sao')
const generator = path.join(__dirname, '../..')

describe('Readme', () => {
  describe('Use default values', () => {
    let helper

    beforeAll(async () => {
      helper = await sao.mock({
        generator,
      })
      return true
    })

    test('Readme file', async () => {
      const expected = fs.readFileSync(path.resolve(__dirname, '../fixtures/README.ejs'))
        .toString()
      const license = await helper.readFile('README.md')

      expect(license).toEqual(expected)
    })
  })
})
