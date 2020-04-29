import { resolve } from 'path'
import { getTmpRoot, gitInit, copy, readJson, yarnInstall } from '../helpers/prepare'

let root: string

beforeAll(async () => {
  root = getTmpRoot()
  await copy(resolve(__dirname, '../fixtures/monorepo'), root)
  await gitInit(root)
  await yarnInstall(root)
})

test('Add package A to B', async () => {
  const packageJson = await readJson(resolve(root, 'packages/@monorepo/pkg-b/package.json'))
  expect(packageJson.version).toEqual('1.1.2')
})
