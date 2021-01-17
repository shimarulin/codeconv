import { existsSync } from 'fs'
import { join } from 'path'
import * as yargs from 'yargs'
import { getModuleList } from './resolver'

const project = join(__dirname, '../tsconfig.json')
const dev = existsSync(project)
const program = yargs

export const run = async (): Promise<void> => {
  const [
    localPlugins,
    globalPlugins,
  ] = await getModuleList([
    '**/@codeconv/plugin-*',
    '**/codeconv-plugin-*',
  ])

  const plugins = [
    ...globalPlugins,
    ...localPlugins,
  ]

  plugins.forEach((pluginPath) => {
    program.commandDir(pluginPath, {
      recurse: true,
      extensions: dev
        ? [
            'ts',
          ]
        : [
            'js',
          ],
      include: new RegExp(`${pluginPath}/${dev ? 'src' : '(lib|dist)'}/.*`),
    })
  })

  program.parse()
}
