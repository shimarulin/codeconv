import { join } from 'path'
import { tmpdir } from 'os'
import { randomBytes } from 'crypto'
import { copy, readJson } from 'fs-extra'
import * as execa from 'execa'
import { command } from 'execa'

export {
  command,
  copy,
  readJson,
  execa,
}

export const getTmpRoot = (prefix = 'mock-'): string => join(tmpdir(), `${prefix}${randomBytes(10).toString('hex')}`)

export const gitInit = async (cwd: string): Promise<void> => {
  await command('git init', {
    cwd,
  })
  await command('git add .', {
    cwd,
  })
  await execa('git', [
    'commit',
    '-m',
    'chore: init',
  ], {
    cwd,
  })
}
export const yarnInstall = async (cwd: string): Promise<void> => {
  await command('yarn install', {
    cwd,
  })
}
