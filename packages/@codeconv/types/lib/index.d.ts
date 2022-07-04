import type { PackageJson } from 'type-fest'

export interface ManifestBase extends PackageJson {
  /**
   The name of the package.
   */
  name: string

  /**
   Package version, parseable by [`node-semver`](https://github.com/npm/node-semver).
   */
  version: string
}
