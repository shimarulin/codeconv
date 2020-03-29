const path = require('path')
const sao = require('sao')
const generator = path.join(__dirname, '../..')
const { readJsonFile } = require('../helpers/readJsonFile')

jest.mock('../../lib/getCwdConfig', () => {
  return {
    packageConfig: {
      license: 'MIT',
      workspaces: [
        'packages/@test/*',
      ],
      repository: {
        type: 'git',
        url: 'git@github.com:owner/project.git',
      },
    },
    lernaConfig: {
      version: '0.1.2',
      npmClient: 'yarn',
      useWorkspaces: true,
    },
  }
})

describe('Add package to GitHub hosted monorepo', () => {
  let helper

  beforeAll(async () => {
    helper = await sao.mock({
      generator,
    })
    return true
  })

  test('Property "homepage" in "package.json"', async () => {
    const pkg = await readJsonFile(helper)
    expect(pkg.homepage).toEqual('https://github.com/owner/project/tree/master/packages/@test/output#readme')
  })
})
