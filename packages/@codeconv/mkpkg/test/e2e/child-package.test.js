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

describe('A call in the monorepo root with default values.', () => {
  const fileList = [
    'LICENSE',
    'README.md',
    'package.json',
  ].sort()
  let helper

  beforeAll(async () => {
    helper = await sao.mock({
      generator,
    })
    return true
  })

  test('Default filesystem structure', async () => {
    expect(helper.fileList.sort()).toEqual(fileList)
  })

  test('Version property in "package.json"', async () => {
    const pkg = await readJsonFile(helper)
    expect(pkg.version).toBe('0.1.2')
  })

  test('Name property in "package.json"', async () => {
    const pkg = await readJsonFile(helper)
    expect(pkg.name).toBe('@test/output')
  })

  test('Property "bugs" in "package.json"', async () => {
    const pkg = await readJsonFile(helper)
    expect(pkg.bugs).toEqual({
      url: 'https://github.com/owner/project/issues',
    })
  })

  test('Property "repository" in "package.json"', async () => {
    const pkg = await readJsonFile(helper)
    expect(pkg.repository).toEqual({
      type: 'git',
      url: 'git@github.com:owner/project.git',
      directory: 'packages/@test/output',
    })
  })

  test('Child package path', async () => {
    expect(helper.api.opts.outDir).toContain('/packages/@test/output')
  })

  test('Property "private" in "package.json"', async () => {
    const pkg = await readJsonFile(helper)
    expect(pkg.private).toBeUndefined()
  })
})
