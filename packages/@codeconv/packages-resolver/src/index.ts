import { readFile } from 'node:fs/promises'
import path from 'node:path'
import fg from 'fast-glob'
import { execa } from 'execa'
import { pipe, andThen, pipeWith, curry, map, filter, complement, isNil } from 'ramda'
import type { PackageJson } from 'type-fest'

export interface ExportDefault<T> {
  default: T
}

export interface PackageManifest extends PackageJson {
  /**
   The name of the package.
   */
  name: string

  /**
   Package version, parseable by [`node-semver`](https://github.com/npm/node-semver).
   */
  version: string
}

export const isNotNil: <T> (x: T | null) => x is T = complement(isNil)
export const filterNotNil: <T> (x: (T | null)[]) => T[] = curry(filter)(isNotNil)

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
    return JSON.parse(jsonStr) as PackageManifest
  })
}

export async function getManifestList (modulePathList: string[]) {
  return Promise.all(map(getManifest, modulePathList))
}

export function getModuleNameList (manifestList: PackageManifest[]) {
  return map((m) => m.name, manifestList)
}

export async function getModule <T> (moduleName: string) {
  return import(moduleName).catch((e) => {
    console.error(e)

    return null
  }) as Promise<ExportDefault<T> | T | null>
}

export async function getModuleList <T> (moduleNameList: string[]) {
  return Promise.all(map((n) => getModule<T>(n), moduleNameList))
}

export function normalizeExport <T> (moduleExport: ExportDefault<T> | T) {
  return moduleExport && 'default' in moduleExport ? moduleExport.default : moduleExport
}

export function curryGetModulesPathList (patterns: string[]) {
  return curry(getModulesPathList)(patterns)
}

export function normalizeExportList <T> (arg: (ExportDefault<T> | T)[]): T[] {
  return map(normalizeExport, arg)
}

export async function resolveModuleList <T> (patterns: string[], global?: boolean): Promise<T[]> {
  return pipe(
    getNpmRoot,
    andThen(curryGetModulesPathList(patterns)),
    andThen(getManifestList),
    andThen(getModuleNameList),
    andThen(getModuleList<T>),
    andThen(filterNotNil),
    andThen(normalizeExportList),
  )(global)
}

export async function resolveModuleListWith <T> (patterns: string[], global?: boolean) {
  return pipeWith<[global?: boolean | undefined], Promise<T[]>>(andThen, [
    getNpmRoot,
    curry(getModulesPathList)(patterns),
    getManifestList,
    getModuleNameList,
    getModuleList,
    curry(map)(normalizeExport),
    curry(filter)(isNotNil),
  ])(global)
}
