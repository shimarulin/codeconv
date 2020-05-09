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

export interface PackagesPath {
  root?: string;
  current?: string;
  manifest?: Package;
}

export const resolvePackages = async (): Promise<PackagesPath> => {
  const currentPackage = await findUp(PKG_FILE_NAME, {
    type: 'file',
  })
  const currentPackageDir = currentPackage && dirname(currentPackage)
  const parentPackage = currentPackageDir && await findUp(PKG_FILE_NAME, {
    type: 'file',
    cwd: resolve(currentPackageDir, '../'),
  })

  const parentPackageDir = parentPackage && dirname(parentPackage)

  const current = currentPackageDir
  const root = parentPackageDir || currentPackageDir
  const manifest = root && await readJson(resolve(root, PKG_FILE_NAME))

  return {
    root,
    current,
    manifest,
  }
}
