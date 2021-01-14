import { resolve, join } from 'path'
import { Arguments, Options } from 'yargs'
import { getGitConfig } from '@codeconv/git-config-parser'
import { GitUrlParser } from '@codeconv/git-url-parser'
import { getRootPkg, getStrScopes, PackageManifest } from '@codeconv/project-resolver'
import { CommandRunner } from '@codeconv/command-runner'
import { licenseMap } from '@codeconv/license'
import { runPrompts, PromptDefaults, PromptOverrides, PromptData } from './runPrompts'
import { runActions } from './runActions'

export interface AddCommandArguments {
  pkg?: string;
}
type GitCommitType = 'init' | 'done'

export const command = 'create [pkg]'
export const describe = 'Create standard project or package from template'

export const builder: { [key: string]: Options } = {}

export const handler = async ({ pkg }: Arguments<AddCommandArguments>): Promise<void> => {
  const [
    git,
    rootPkg,
  ] = await Promise.all([
    getGitConfig(),
    getRootPkg(),
  ])

  const isProject = rootPkg !== undefined
  // const hasWorkspaces = rootPkg && Array.isArray(rootPkg.manifest.workspaces) && rootPkg.manifest.workspaces.length > 0
  const workspaces: string[] = (rootPkg && Array.isArray(rootPkg.manifest.workspaces) && rootPkg.manifest.workspaces) || []
  const repositoryUrl = (rootPkg && typeof rootPkg.manifest.repository === 'object' && rootPkg.manifest.repository.url) || git.remote?.origin.url

  // TODO: refactor (delete?)
  const data: PromptData = {
    namespaces: getStrScopes(workspaces),
  }
  const overrides: PromptOverrides = {
    type: isProject ? 'package' : undefined,
    origin: repositoryUrl,
    namespace: Array.isArray(data.namespaces) && data.namespaces.length === 1 ? data.namespaces[0] : undefined,
    // version: '0.1.6',
  }
  const defaults: PromptDefaults = {
    name: pkg,
    author: git.user.name,
    email: git.user.email,
    license: 'MIT',
    version: '1.0.0',
  }

  const answers = await runPrompts(overrides, defaults, data)

  // TODO: simplify
  const isNewProject = !isProject
  // TODO: improve license package
  const licenseSource = licenseMap[answers.license]
  const getLocalDir = (): string => join('packages', answers.namespace, (pkg || answers.name))
  const gitUrl = new GitUrlParser(answers.origin, answers.type === 'package' ? getLocalDir() : '')
  const target = rootPkg
    ? resolve(rootPkg?.directory, getLocalDir())
    : resolve(process.cwd(), (pkg || answers.name))

  const rootScripts = {
    prepare: 'git config core.hooksPath .hooks',
  }
  const manifest: PackageManifest = {
    name: answers.namespace ? `${answers.namespace}/${answers.name}` : answers.name,
    version: answers.version,
    description: answers.description,
    license: answers.license,
    private: !answers.publish ? true : undefined,
    publishConfig: answers.publish
      ? {
          access: 'public',
        }
      : undefined,
    repository: {
      ...gitUrl.repository,
    },
    bugs: {
      ...gitUrl.bugs,
    },
    scripts: {},
    homepage: gitUrl.homepage,
    author: `${answers.author} <${answers.email}>`,
    workspaces: answers.type === 'monorepo'
      ? [
      `packages/@${answers.name}/*`,
        ]
      : undefined,
  }

  isNewProject && Object.assign(manifest.scripts, rootScripts)

  const year = new Date().getFullYear()
  const license = {
    ...licenseSource,
    // TODO: Need alternative of spdx-license-list/spdx-full.json, because it's have inconsistent descriptor for year and author
    licenseText: licenseSource.licenseText
      .replace('<year>', year.toString())
      .replace('<copyright holders>', answers.author),
  }

  await runActions({
    projectType: answers.type,
    license,
    manifest,
  }, target)

  const runner = new CommandRunner(target)
  const devDependencies: string[] = []

  if (isNewProject) {
    devDependencies.push(
      'lint-staged',
      'eslint',
      '@codeconv/eslint-config-base',
      // https://commitlint.js.org/#/
      '@commitlint/cli',
      '@commitlint/config-conventional',
      // 'format-package',
      'prettier',
      'prettier-plugin-packagejson',
    )
  }

  // if (answers.type === 'monorepo') {
  //   devDependencies.push(
  //     '@codeconv/codeconv',
  //     '@codeconv/plugin-create',
  //     '@codeconv/plugin-add',
  //     '@codeconv/plugin-extend',
  //   )
  // }

  const install = async (): Promise<void> => {
    if (devDependencies.length > 0) {
      const flags = [
        '--silent',
        '-D',
      ]

      answers.type === 'monorepo' && flags.push('-W')
      await runner.exec(`yarn add ${[
        ...flags,
        ...devDependencies,
      ].join(' ')}`)
    }
  }

  const commit = async (type: GitCommitType): Promise<void> => {
    const gitStatus = await runner.exec('git status --porcelain')
    if (gitStatus.stdout.length > 0) {
      const commitMsgPrefix = `chore${!isNewProject ? `(${manifest.name})` : ''}:`
      const commitMsgHeaders: {[key in GitCommitType]: string} = {
        init: 'init',
        done: `${devDependencies.length > 0 ? 'add development dependencies and' : ''} apply code style`,
      }
      await runner.exec('git add .')
      await runner.exec(`git commit --quiet -m "${commitMsgPrefix} ${commitMsgHeaders[type]}"`)
    }
  }

  isNewProject && await runner.exec('git init --quiet')
  isNewProject && answers.origin && await runner.exec(`git remote add origin ${gitUrl.repository.url}`)
  isNewProject && await commit('init')
  isNewProject && await install()
  await commit(isNewProject ? 'done' : 'init')
}
