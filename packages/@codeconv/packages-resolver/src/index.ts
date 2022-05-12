import { readFile } from 'node:fs/promises'
import path from 'node:path'
import fg from 'fast-glob'
import { execa } from 'execa'

interface NpmRoots {
  globalNpmRoot: string
  localNpmRoot: string
}

interface PkgDefaultImport {
  name: string,
  version: string,
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

export const getPackageDirs = async (patterns: string[], scope: 'global' | 'local'): Promise<string[]> => {
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

export const getPackageList = async (patterns: string[], scope: 'global' | 'local'): Promise<string[]> => {
  const packageNameImports: Promise<string>[] = []
  const packageDirs = await getPackageDirs(patterns, scope)

  packageDirs.forEach((dir) => {
    const packageImport: Promise<PkgDefaultImport> = readFile(path.resolve(dir, 'package.json'), {
      encoding: 'utf8',
    }).then((jsonStr) => JSON.parse(jsonStr) as PkgDefaultImport)

    packageNameImports.push(
      packageImport.then((pkg) => pkg.name),
    )
  })

  return Promise.all(packageNameImports)
}
