import * as path from 'path'
import * as findUp from 'find-up'
import * as execa from 'execa'
import * as fg from 'fast-glob'
import { ExecaReturnValue } from 'execa'

const getStdout = (value: ExecaReturnValue): string => {
  return value.stdout
}

const resolveNodeModules = (prefix: string): Promise<string> => {
  return fg([
    '**/node_modules',
  ], {
    absolute: true,
    onlyDirectories: true,
    cwd: prefix,
    deep: 2,
  }).then(pathList => pathList[0])
}

const resolveParentNodeModules = (nodeModulesPath: string): Promise<string> => {
  return findUp('node_modules', {
    type: 'directory',
    cwd: path.resolve(nodeModulesPath, '../../'),
  }).then(pathItem => pathItem || nodeModulesPath)
}

const findPlugins = (nodeModulesPath: string): Promise<string[]> => {
  return fg([
    '@codeconv/plugin-create',
    '**/@codeconv/plugin-*',
    '**/codeconv-plugin-*',
  ], {
    absolute: true,
    onlyDirectories: true,
    cwd: nodeModulesPath,
    // deep: 2,
    followSymbolicLinks: true,
  })
}

(async () => {
  const [
    local,
    global,
  ] = await Promise.all([
    execa('npm', [
      'prefix',
    ])
      .then(getStdout)
      .then(resolveNodeModules)
      .then(resolveParentNodeModules)
      .then(findPlugins),
    execa('npm', [
      'prefix',
      '-g',
    ])
      .then(getStdout)
      .then(resolveNodeModules)
      .then(findPlugins),
  ])

  console.log([
    ...global,
    ...local,
  ])
})()
