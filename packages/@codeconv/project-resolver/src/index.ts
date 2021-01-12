import { dirname, resolve } from 'path'

import * as fastGlob from 'fast-glob'
import * as findUp from 'find-up'
import { readJson } from 'fs-extra'
import { PackageJson } from 'type-fest'

export const PKG_FILE_NAME = 'package.json'

export interface PackageManifest extends PackageJson {
  publishConfig?: {
    access: 'public';
  };
}

export interface PackageInfo {
  manifest: PackageManifest;
  directory: string;
}

// export interface ChildPackageInfo extends PackageInfo {
//   scope?: string;
// }

export interface ProjectInfo extends PackageInfo {
  child?: PackageInfo[];
}

export const getPkgInfoByPath = async (pkgFullPath: string): Promise<PackageInfo> => {
  const pkgDir = dirname(pkgFullPath)
  const pkgManifest = await readJson(resolve(pkgFullPath)) as PackageManifest

  return {
    manifest: pkgManifest,
    directory: pkgDir,
  } as PackageInfo
}

export const findPackageUp = async (cwd: string = process.cwd()): Promise<PackageInfo | undefined> => {
  const pkgFullPath = await findUp(PKG_FILE_NAME, {
    type: 'file',
    cwd,
  })

  return pkgFullPath
    ? await getPkgInfoByPath(pkgFullPath)
    : undefined
}

export const findPackagesDown = async (workspaces: string[], baseDir: string): Promise<PackageInfo[]> => {
  const patterns = workspaces.map((workspace) => `${workspace}/${PKG_FILE_NAME}`)
  const pkgPaths = await fastGlob(patterns, {
    absolute: true,
    cwd: baseDir,
  })

  return await Promise.all(
    pkgPaths.map((pkgPath) => getPkgInfoByPath(pkgPath)),
  )
}

export const getRootPkg = async (cwd: string = process.cwd()): Promise<PackageInfo | undefined> => {
  const pkgInfo = await findPackageUp(cwd)

  return (pkgInfo && await getRootPkg(resolve(pkgInfo.directory, '../'))) || pkgInfo
}

export const getProjectInfo = async (): Promise<ProjectInfo | undefined> => {
  const projectInfo: ProjectInfo | undefined = await getRootPkg()

  if (projectInfo && Array.isArray(projectInfo.manifest.workspaces)) {
    projectInfo.child = await findPackagesDown(projectInfo.manifest.workspaces, projectInfo.directory)
  }

  return projectInfo
}
