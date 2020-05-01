import { resolve } from 'path'
import { getTmpRoot } from '@codeconv/utils'
import { copy, readJson, yarnInstall, execa, keys } from '../helpers/prepare'

describe('Install packages to package B from the directory "packages/@monorepo/pkg-b"', () => {
  let root: string

  beforeAll(async () => {
    root = getTmpRoot()
    await copy(resolve(__dirname, '../fixtures/monorepo'), root)
    await yarnInstall(root)
  })

  test('Add package A to B', async () => {
    const subprocess = execa('node', [
      resolve(__dirname, '../helpers/wrapper.js'),
      'add',
      '@monorepo/pkg-a',
    ], {
      cwd: resolve(root, 'packages/@monorepo/pkg-b'),
    })

    await subprocess
    const packageJson = await readJson(resolve(root, 'packages/@monorepo/pkg-b/package.json'))
    expect(packageJson.version).toEqual('1.1.2')
  })

  test('Select package C and install to B. Package A should be disabled', async () => {
    const subprocess = execa('node', [
      resolve(__dirname, '../helpers/wrapper.js'),
      'add',
    ], {
      cwd: resolve(root, 'packages/@monorepo/pkg-b'),
    })

    subprocess.stdout?.on('data', (data: Buffer) => {
      const str = data.toString()
      if (str.search('Select the package to be add') !== -1) {
        subprocess.stdin?.write(keys.down)
        subprocess.stdin?.write(keys.enter)
      }
    })

    await subprocess
    const packageJson = await readJson(resolve(root, 'packages/@monorepo/pkg-b/package.json'))
    expect(packageJson.version).toEqual('1.1.2')
  })
})
