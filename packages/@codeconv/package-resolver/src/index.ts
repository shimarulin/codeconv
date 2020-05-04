import { dirname, resolve } from 'path'
import * as findUp from 'find-up'

const PKG_FILE_NAME = 'package.json'
// const TSC_FILE_NAME = 'tsconfig.json'

export interface PackagesPath {
  root?: string;
  current?: string;
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

  return {
    root,
    current,
  }
}
