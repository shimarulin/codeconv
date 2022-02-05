const path = require('path')
const sao = require('sao')
const generator = path.join(__dirname, '../..')
const { readJsonFile } = require('../helpers/readJsonFile')

describe('Use default values', () => {
  const fileList = [
    '.editorconfig',
    '.eslintignore',
    '.eslintrc.js',
    '.gitignore',
    '.prettierignore',
    '.prettierrc.js',
    'LICENSE',
    'README.md',
    'package.json',
    '.commitlintrc.js',
  ].sort()
  let helper

  beforeAll(async () => {
    helper = await sao.mock({
      generator,
    })
    return true
  })

  test('Output path', async () => {
    expect(helper.api.opts.outDir).toContain('output')
  })

  test('Filesystem structure', () => {
    expect(helper.fileList.sort()).toEqual(fileList)
  })

  test('Version property in "package.json"', async () => {
    const pkg = await readJsonFile(helper)
    expect(pkg.version).toBe('0.0.0-development')
  })

  test('Name property in "package.json"', async () => {
    const pkg = await readJsonFile(helper)
    expect(pkg.name).toBe('output')
  })

  test('Property "private" in "package.json"', async () => {
    const pkg = await readJsonFile(helper)
    expect(pkg.private).toBeUndefined()
  })
})

describe('Set repository URL with default options', () => {
  let helper

  beforeAll(async () => {
    helper = await sao.mock({
      generator,
    },
    {
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

describe('GitLab repository URL', () => {
  let helper

  beforeAll(async () => {
    helper = await sao.mock({
      generator,
    },
    {
      origin: 'git@gitlab.com:owner/project.git',
    })
    return true
  })

  test('Property "homepage" in "package.json"', async () => {
    const pkg = await readJsonFile(helper)
    expect(pkg.homepage).toBe('https://gitlab.com/owner/project')
  })
})
