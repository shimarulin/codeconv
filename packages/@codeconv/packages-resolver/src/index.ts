import { readFile } from 'node:fs/promises'
import path from 'node:path'
import fg from 'fast-glob'
import { execa } from 'execa'
import type { PackageJson } from 'type-fest'

export interface NpmRoots {
  globalNpmRoot: string
  localNpmRoot: string
}

export type ModuleScope = 'global' | 'local'

export interface ExportDefault<T> {
  default: T
}

export interface Manifest extends PackageJson {
  /**
   The name of the package.
   */
  name: string

  /**
   Package version, parseable by [`node-semver`](https://github.com/npm/node-semver).
   */
  version: string
}

export interface ModuleMeta {
  modulePath: string
  manifest: Manifest
  scope: ModuleScope
}

export interface Module<T> extends ModuleMeta {
  module: T
}

export const getNpmRoots = async (): Promise<NpmRoots> => {
  return Promise.all([
    execa('npm', [
      'root',
      '--global',
    ]).then(({ stdout }) => stdout),
    execa('npm', [
      'root',
    ]).then(({ stdout }) => stdout),
  ]).then(([
    globalNpmRoot,
    localNpmRoot,
  ]) => ({
    globalNpmRoot,
    localNpmRoot,
  }))
}

export const resolvePackagesFromDir = async (patterns: string[], basePath: string): Promise<string[]> => {
  return fg(patterns, {
    absolute: true,
    onlyDirectories: true,
    cwd: basePath,
  })
}

export const getModulePathList = async (patterns: string[], scope: ModuleScope): Promise<string[]> => {
  const packageDirs: string[] = []
  const { globalNpmRoot, localNpmRoot } = await getNpmRoots()

  const [
    globalPackages,
    localPackages,
  ] = await Promise.all([
    resolvePackagesFromDir(patterns, globalNpmRoot),
    resolvePackagesFromDir(patterns, localNpmRoot),
  ])

  if (scope === 'global') {
    packageDirs.push(...globalPackages)
  } else if (scope === 'local') {
    packageDirs.push(...localPackages)
  }

  return packageDirs
}

export const getModuleMetaInfoList = async (patterns: string[], scope: ModuleScope): Promise<ModuleMeta[]> => {
  const modulePathList = await getModulePathList(patterns, scope)

  return Promise.all(modulePathList.map((modulePath) => {
    return readFile(path.resolve(modulePath, 'package.json'), {
      encoding: 'utf8',
    }).then((jsonStr) => {
      return JSON.parse(jsonStr) as Manifest
    }).then((manifest): ModuleMeta => {
      return {
        modulePath,
        manifest,
        scope,
      }
    })
  }))
}

export const getModuleList = async <T>(moduleMetaList: ModuleMeta[]) => {
  return Promise.all(moduleMetaList.map((moduleMeta) => {
    return import(moduleMeta.manifest.name)
      .then((templateModuleExport: ExportDefault<T> | T) => {
        return 'default' in templateModuleExport ? templateModuleExport.default : templateModuleExport
      })
      .then((templateModule) => {
        return {
          ...moduleMeta,
          module: templateModule,
        }
      })
  }))
}

// export function hasModule<T> (meta: ModuleMeta<T>): meta is ModuleMeta<T> {
//   return !!meta.module
// }
