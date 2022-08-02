import { rm } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
import { runTemplateFlow } from '../runTemplateFlow'

const pathToFlatTemplate = join(__dirname, '__fixtures__/flat-template')
const pathToDeepTemplate = join(__dirname, '__fixtures__/deep-template')
const pathToDeepTemplateDup = join(__dirname, '__fixtures__/deep-template-duplicate')
const pathToNotExistTemplate = join(__dirname, '__fixtures__/not-exist')

describe('Run template flow', () => {
  test('merge templates', async () => {
    const targetDir = join(tmpdir(), 'tpl-mt')
    const fileList = await runTemplateFlow(
      [
        pathToFlatTemplate,
        pathToDeepTemplate,
      ],
      [],
      {},
      targetDir,
    )

    fileList.forEach((fileMeta) => {
      expect(fileMeta).toMatchSnapshot()
    })

    await rm(targetDir, {
      recursive: true,
      force: true,
    })
  })

  test('merge duplicate templates', async () => {
    const targetDir = join(tmpdir(), 'tpl-mdt')
    const runner = async () => {
      return runTemplateFlow(
        [
          pathToFlatTemplate,
          pathToDeepTemplate,
          pathToDeepTemplateDup,
        ],
        [],
        {},
        targetDir,
      )
    }

    await expect(runner).rejects.toThrow(`File 'src/func/log.js' from template directory ${pathToDeepTemplateDup} already exist in ${pathToDeepTemplate}. You can't write more than one file to the same target path`)
  })

  test('handle non exist template', async () => {
    const targetDir = join(tmpdir(), 'tpl-mdt')
    const runner = async () => {
      return runTemplateFlow(
        [
          pathToFlatTemplate,
          pathToDeepTemplate,
          pathToNotExistTemplate,
        ],
        [],
        {},
        targetDir,
      )
    }

    await expect(runner).rejects.toThrow(`ENOENT: no such file or directory, opendir '${pathToNotExistTemplate}'`)
  })
})
