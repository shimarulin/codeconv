import { dirname, resolve } from 'path'
import * as findUp from 'find-up'
import { readJson } from 'fs-extra'

export const PKG_FILE_NAME = 'package.json'
// const TSC_FILE_NAME = 'tsconfig.json'

interface Dependencies {
  [key: string]: string;
}

export interface Repository {
  directory?: string;
  type: string;
  url: string;
}

export interface Package {
  [key: string]: string | boolean | string[] | object | undefined;
  name: string;
  version?: string;
  description?: string;
  license?: string;
  private?: boolean;
  publishConfig?: {
    access: 'public';
  };
  repository: Repository;
  bugs: {
    url: string;
  };
  homepage: string;
  author: string;
  workspaces?: string[];
  dependencies?: Dependencies;
  devDependencies?: Dependencies;
}

export interface PackageDescriptor {
  manifest: Package;
  path: string;
}

export interface Packages {
  root?: PackageDescriptor;
  current?: PackageDescriptor;
}

const getPkgDescriptor = async (workingDir: string = process.cwd()): Promise<(PackageDescriptor | undefined)> => {
  const currentPackage = await findUp(PKG_FILE_NAME, {
    type: 'file',
    cwd: workingDir,
  })
  const currentPath = currentPackage && dirname(currentPackage)
  const currentManifest: Package = currentPackage && await readJson(resolve(currentPackage))

  return currentPath ? {
    path: currentPath,
    manifest: currentManifest,
  } : undefined
}

export const resolvePackages = async (): Promise<PackageDescriptor[]> => {
  const pkgDescriptors: PackageDescriptor[] = []

  const runSearch = async (path?: string): Promise<void> => {
    const workingDir = path && resolve(path, '../')
    const a = await getPkgDescriptor(workingDir)
    if (a) {
      pkgDescriptors.push(a)
      await runSearch(a.path)
    }
  }

  await runSearch()

  return pkgDescriptors
}
