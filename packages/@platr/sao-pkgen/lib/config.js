const { packageConfig, lernaConfig } = require('./getCwdConfig')

const DEFAULT_LICENSE = 'MIT'
const DEFAULT_VERSION = '0.1.0'
const PROJECT_TYPES = [
  'Package',
  'Monorepo',
]
const DEFAULT_PROJECT_TYPE = 'Package'

const hasMonorepo = lernaConfig && true
const workspaces = lernaConfig && packageConfig ? packageConfig.workspaces.map(workspace => workspace.replace('*', '')) : []
const defaultPackagePath = lernaConfig ? workspaces[0] : ''

module.exports = {
  hasMonorepo,
  defaultPackagePath,
  projectTypes: PROJECT_TYPES,
  defaultProjectType: DEFAULT_PROJECT_TYPE,
  defaultVersion: lernaConfig ? lernaConfig.version : DEFAULT_VERSION,
  defaultLicense: packageConfig ? packageConfig.license : DEFAULT_LICENSE,
}
