import path from 'path'
import { findUp } from 'find-up'

interface BaseFsContext {
  manifest: string
  directory: string
}

interface ReverseFsContext extends BaseFsContext {
  parent?: ReverseFsContext
}

interface FsContext extends BaseFsContext {
  root: boolean
  child?: FsContext
}

interface CodeConvContext {
  project?: FsContext
}

export async function pkgUp (cwd: string | URL = process.cwd()) {
  return findUp('package.json', {
    cwd,
  })
}

export async function getBaseFsContext (cwd: string | URL = process.cwd()): Promise<BaseFsContext | undefined> {
  return pkgUp(cwd)
    .then((packageManifestPath) => {
      return packageManifestPath
        ? {
            manifest: packageManifestPath,
            directory: path.dirname(packageManifestPath),
          }
        : undefined
    })
}

export async function getReverseFsContext (cwd: string | URL = process.cwd()): Promise<ReverseFsContext | undefined> {
  const baseFsContext = await getBaseFsContext(cwd)

  return baseFsContext && {
    ...baseFsContext,
    parent: await getReverseFsContext(path.resolve(baseFsContext.directory, '../')),
  }
}

export function normalizeFsContext ({ manifest, directory, parent }: ReverseFsContext, child?: FsContext): FsContext {
  if (parent) {
    return normalizeFsContext({
      manifest: parent.manifest,
      directory: parent.directory,
      parent: parent.parent,
    }, {
      root: false,
      manifest,
      directory,
      child,
    })
  } else {
    return {
      root: true,
      manifest,
      directory,
      child,
    }
  }
}

export async function getFsContext (cwd: string | URL = process.cwd()): Promise<FsContext | undefined> {
  const reverseFsContext = await getReverseFsContext(cwd)

  return reverseFsContext && normalizeFsContext(reverseFsContext)
}

export const getContext = async (): Promise<CodeConvContext> => {
  const fsContext = await getFsContext()

  return {
    project: fsContext,
  }
}
