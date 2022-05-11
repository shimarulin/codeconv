import path from 'path'
import fg from 'fast-glob'
import { execa } from 'execa'

interface NpmRoots {
  globalNpmRoot: string
  localNpmRoot: string
}

interface PkgDefaultImport {
  default: {
    name: string,
    version: string,
  }
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
  } else {
    // All packages
    // Prefer local packages
  }

  return packageDirs
}

export const getPackageList = async (patterns: string[], scope: 'global' | 'local'): Promise<string[]> => {
  const packageNameImports: Promise<string>[] = []
  const packageDirs = await getPackageDirs(patterns, scope)

  packageDirs.forEach((dir) => {
    const packageImport: Promise<PkgDefaultImport> = import(path.resolve(dir, 'package.json'), {
      assert: {
        type: 'json',
      },
    }) as Promise<PkgDefaultImport>

    packageNameImports.push(
      packageImport.then((pkg) => pkg.default.name),
    )
  })

  return Promise.all(packageNameImports)
}
