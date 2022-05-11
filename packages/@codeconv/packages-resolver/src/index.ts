import fg from 'fast-glob'
import { execa } from 'execa'

interface NpmRoots {
  globalNpmRoot: string
  localNpmRoot: string
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
  const packages: string[] = []
  const { globalNpmRoot, localNpmRoot } = await getNpmRoots()

  const [
    globalPackages,
    localPackages,
  ] = await Promise.all([
    resolvePackagesFromDir(patterns, globalNpmRoot),
    resolvePackagesFromDir(patterns, localNpmRoot),
  ])

  if (scope === 'global') {
    packages.push(...globalPackages)
  } else if (scope === 'local') {
    packages.push(...localPackages)
  } else {
    // All packages
    // Prefer local packages
  }

  return packages
}
