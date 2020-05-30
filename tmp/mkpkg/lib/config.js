const { packageConfig, lernaConfig } = require('./getCwdConfig')

const DEFAULT_LICENSE = 'MIT'
const DEFAULT_VERSION = '0.0.0-development'
const PROJECT_TYPES = [
  'Package',
  'Monorepo',
]
const DEFAULT_PROJECT_TYPE = 'Package'

const hasMonorepo = lernaConfig && true
const moduleType = packageConfig && lernaConfig ? 'package' : 'project'
const workspaces = lernaConfig && packageConfig ? packageConfig.workspaces.map(workspace => workspace.replace('/*', '')) : []
const defaultPackagePath = lernaConfig ? workspaces[0] : ''

module.exports = {
  moduleType,
  hasMonorepo,
  defaultProjectUrl: packageConfig && packageConfig.repository && (packageConfig.repository.url || packageConfig.repository),
  defaultPackagePath,
  projectTypes: PROJECT_TYPES,
  defaultProjectType: DEFAULT_PROJECT_TYPE,
  defaultVersion: lernaConfig ? lernaConfig.version : DEFAULT_VERSION,
  defaultLicense: packageConfig ? packageConfig.license : DEFAULT_LICENSE,
}
