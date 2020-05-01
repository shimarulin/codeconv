import { join } from 'path'
import { tmpdir } from 'os'
import { randomBytes } from 'crypto'
import * as fsExtra from 'fs-extra'
import { copy, readJson } from 'fs-extra'
import * as execa from 'execa'
import { command } from 'execa'
import { keys } from './keys'

export {
  command,
  copy,
  readJson,
  fsExtra,
  execa,
  keys,
}

export const getTmpRoot = (prefix = 'mock-'): string =>
  join(tmpdir(), `${prefix}${randomBytes(10).toString('hex')}`)
