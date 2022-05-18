import { readFile } from 'node:fs/promises'
import path from 'node:path'
import fg from 'fast-glob'
import { execa } from 'execa'
import { pipe, andThen, pipeWith, curry } from 'ramda'
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

export async function getNpmRoot (global?: boolean): Promise<string> {
  const npmArgs = [
    'root',
    '--global',
  ].slice(0, global ? 2 : 1)

  return execa('npm', npmArgs).then(({ stdout }) => stdout)
}

export function getModulesPathList (patterns: string[], basePath: string): Promise<string[]> {
  return fg(patterns, {
    absolute: true,
    onlyDirectories: true,
    cwd: basePath,
  })
}

export async function getManifest (modulePath: string) {
  return readFile(path.resolve(modulePath, 'package.json'), {
    encoding: 'utf8',
  }).then((jsonStr) => {
    return JSON.parse(jsonStr) as Manifest
  })
}

export async function getManifestList (modulePathList: string[]) {
  return Promise.all(modulePathList.map((modulePath) => getManifest(modulePath)))
}

export function getModuleNameList (manifestList: Manifest[]) {
  return manifestList.map((manifest) => manifest.name)
}

export async function getExtendedManifestList (modulePathList: string[]) {
  return Promise.all(
    modulePathList.map((path) => getManifest(path)
      .then((manifest) => ({
        path,
        manifest,
      }))),
  )
}

export async function getModule <T> (moduleName: string) {
  return import(moduleName).catch((e) => {
    console.error(e)

    return null
  }) as Promise<ExportDefault<T> | T | null>
}

export async function getModuleList <T> (moduleNameList: string[]) {
  return Promise.all(moduleNameList.map((moduleName) => getModule<T>(moduleName)))
}

export function normalizeExport <T> (moduleExport: ExportDefault<T> | T | null) {
  return moduleExport && 'default' in moduleExport ? moduleExport.default : moduleExport
}

export async function resolveModuleList <T> (patterns: string[], global?: boolean) {
  const curriedGetModulesPathList = curry(getModulesPathList)(patterns)

  return pipe(
    getNpmRoot,
    andThen(curriedGetModulesPathList),
    andThen(getManifestList),
    andThen(getModuleNameList),
    andThen<string[], Array<ExportDefault<T> | T | null>>(getModuleList),
    andThen(normalizeExport),
  )(global)
}

// export async function resolveModuleObjectList <T> (patterns: string[], global?: boolean) {
//   const curriedGetModulesPathList = curry(getModulesPathList)(patterns)
//   const addModulePaths = (root: string) => getModulesPathList(patterns, root)
//     .then((mPl) => mPl.map((path) => ({
//       root,
//       path,
//     })))
//
//   // const addManifests = (list: {path: string, root: string}[]) => getManifestList()
//
//   return pipe(
//     getNpmRoot,
//     andThen(curriedGetModulesPathList),
//     andThen(getManifestList),
//     andThen(getModuleNameList),
//     andThen<string[], Array<ExportDefault<T> | T>>(getModuleList),
//     andThen(normalizeExport),
//   )(global)
// }

export async function resolveModuleListWith <T> (patterns: string[], global?: boolean) {
  return pipeWith<[global?: boolean | undefined], Promise<T[]>>(andThen, [
    getNpmRoot,
    curry(getModulesPathList)(patterns),
    getManifestList,
    getModuleNameList,
    getModuleList,
    normalizeExport,
  ])(global)
}

export async function resolveModuleObjectListWith <T> (patterns: string[], global?: boolean) {
  return pipeWith<[global?: boolean | undefined], Promise<T[]>>(andThen, [
    getNpmRoot,
    (root: string) => curry(getModulesPathList)(patterns)(root)
      .then((mPl) => mPl.map((path) => ({
        root,
        path,
      }))),
    getManifestList,
    getModuleNameList,
    getModuleList,
    normalizeExport,
  ])(global)
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

export const getModuleListOld = async <T>(moduleMetaList: ModuleMeta[]) => {
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
