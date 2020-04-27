import * as path from 'path'
import * as findUp from 'find-up'
import * as execa from 'execa'
import * as fg from 'fast-glob'
import { ExecaReturnValue } from 'execa'

// TODO: need to fix CLI error if cwd not contain node_modules dir

export const getStdout = (value: ExecaReturnValue): string => {
  return value.stdout
}

export const getSafePathList = (unsafePathList: (string | undefined)[]): string[] => {
  return unsafePathList
    .filter((unsafePath): unsafePath is string => typeof unsafePath === 'string')
}

export const resolveNodeModulesDir = (prefix: string): Promise<string[]> => {
  return fg([
    '**/node_modules',
  ], {
    absolute: true,
    onlyDirectories: true,
    cwd: prefix,
    deep: 2,
  })
}

export const resolveParentNodeModulesDir = (nodeModulesDirList: string[]): Promise<string[]> => {
  return Promise.all(nodeModulesDirList.map((nodeModulesPath) => {
    return findUp('node_modules', {
      type: 'directory',
      cwd: path.resolve(nodeModulesPath, '../../'),
    })
  }))
    .then((parentNodeModulesDirList) => {
      return [
        ...getSafePathList(parentNodeModulesDirList),
        ...nodeModulesDirList,
      ]
    })
}

export const findModules = (nodeModulesDirList: string[], predicate: string | string[]): Promise<string[]> => {
  return Promise.all(nodeModulesDirList.map((nodeModulesDir) => {
    return fg(predicate, {
      absolute: true,
      onlyDirectories: true,
      cwd: nodeModulesDir,
      followSymbolicLinks: true,
    })
  }))
    .then((modulePathGroupList) => {
      return modulePathGroupList.reduce((prev, current) => {
        return [
          ...prev,
          ...current,
        ]
      })
    })
}

export const getModuleList = (predicate: string | string[]): Promise<[string[], string[]]> => {
  return Promise.all([
    execa('npm', [
      'prefix',
    ])
      .then(getStdout)
      .then(resolveNodeModulesDir)
      .then(resolveParentNodeModulesDir)
      .then((nodeModulesDirList) => {
        return findModules(nodeModulesDirList, predicate)
      }),
    execa('npm', [
      'prefix',
      '-g',
    ])
      .then(getStdout)
      .then(resolveNodeModulesDir)
      .then((nodeModulesDirList) => {
        return findModules(nodeModulesDirList, predicate)
      }),
  ])
}
