import * as path from 'path'
import * as fs from 'fs'
import * as yargs from 'yargs'
import { getModuleList } from './resolver'

const project = path.join(__dirname, '../tsconfig.json')
const dev = fs.existsSync(project)
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
      extensions: dev ? [
        'ts',
      ] : [
        'js',
      ],
    })
  })

  program.parse()
}
