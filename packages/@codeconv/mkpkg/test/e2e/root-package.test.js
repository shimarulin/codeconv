const path = require('path')
const sao = require('sao')
const generator = path.join(__dirname, '../..')
const { readJsonFile } = require('../helpers/readJsonFile')

describe('Create monorepo root with default options', () => {
  const fileList = [
    '.editorconfig',
    '.eslintignore',
    '.eslintrc.js',
    '.gitignore',
    '.prettierignore',
    '.prettierrc.js',
    'lerna.json',
    'LICENSE',
    'README.md',
    'package.json',
    '.commitlintrc.js',

  ].sort()
  let helper

  beforeAll(async () => {
    helper = await sao.mock({
      generator,
    },
    {
      type: 'Monorepo',
    })
    return true
  })

  test('Filesystem structure', () => {
    expect(helper.fileList.sort()).toEqual(fileList)
  })

  test('Exclude version property in "package.json"', async () => {
    const pkg = await readJsonFile(helper)

    expect(pkg.version).toBeUndefined()
  })

  test('Version property in "lerna.json"', async () => {
    const pkg = await readJsonFile(helper, 'lerna.json')

    expect(pkg.version).toBe('0.0.0-development')
  })

  test('Name property in "package.json"', async () => {
    const pkg = await readJsonFile(helper)
    expect(pkg.name).toBe('output')
  })

  test('Property "private" in "package.json"', async () => {
    const pkg = await readJsonFile(helper)
    expect(pkg.private).toBe(true)
  })
})

describe('Set repository URL for root package', () => {
  let helper

  beforeAll(async () => {
    helper = await sao.mock({
      generator,
    },
    {
      type: 'Monorepo',
      origin: 'git@github.com:owner/project.git',
    })
    return true
  })

  test('Property "homepage" in "package.json"', async () => {
    const pkg = await readJsonFile(helper)
    expect(pkg.homepage).toBe('https://github.com/owner/project#readme')
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
    })
  })
})
