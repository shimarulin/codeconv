import { resolve } from 'path'
import { Arguments, Options } from 'yargs'
import { getGitConfig } from '@codeconv/git-config-parser'
import { GitUrlParser } from '@codeconv/git-url-parser'
import { Package, PackageDescriptor, resolvePackages } from '@codeconv/package-resolver'
import { CommandRunner } from '@codeconv/command-runner'
import { licenseMap } from '@codeconv/license'
import { runPrompts, PromptDefaults, PromptOverrides, PromptData } from './runPrompts'
import { runActions } from './runActions'

export interface AddCommandArguments {
  pkg?: string;
}

export const command = 'create [pkg]'
export const describe = 'Create standard project or package from template'

export const builder: { [key: string]: Options } = {}

export const handler = async ({ pkg }: Arguments<AddCommandArguments>): Promise<void> => {
  const [
    git,
    packages,
  ] = await Promise.all([
    getGitConfig(),
    resolvePackages(),
  ])
  const rootPkg: PackageDescriptor | undefined = packages.length > 0 ? packages[packages.length - 1] : undefined

  const data: PromptData = {
    namespaces: rootPkg?.manifest.workspaces?.map(workspacePath => {
      const parts = workspacePath
        .replace('/*', '')
        .split('/')
      const ns = parts.pop()
      return ns || ''
    }),
  }
  const overrides: PromptOverrides = {
    type: rootPkg ? 'package' : undefined,
    origin: rootPkg?.manifest?.repository.url || git.remote?.origin.url,
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

  const licenseSource = licenseMap[answers.license]
  const gitUrl = new GitUrlParser(answers.origin)
  const target = rootPkg
    ? resolve(rootPkg?.path, 'packages', answers.namespace, (pkg || answers.name))
    : resolve(process.cwd(), (pkg || answers.name))
  const manifest: Package = {
    name: answers.namespace ? `${answers.namespace}/${answers.name}` : answers.name,
    version: answers.version,
    description: answers.description,
    license: answers.license,
    private: !answers.publish ? true : undefined,
    publishConfig: answers.publish ? {
      access: 'public',
    } : undefined,
    repository: {
      ...gitUrl.repository,
    },
    bugs: {
      ...gitUrl.bugs,
    },
    homepage: gitUrl.homepage,
    author: `${answers.author} <${answers.email}>`,
  }
  const year = new Date().getFullYear()
  const license = {
    ...licenseSource,
    licenseText: licenseSource.licenseText
      .replace('<year>', year.toString())
      .replace('<copyright holders>', answers.author),
  }

  // const runner = new CommandRunner(target)
  // const status = await runner.exec('git status --porcelain')
  // console.log(status.stdout.length === 0)

  await runActions({
    projectType: answers.type,
    license,
    manifest,
  }, target)

  // await runner.spawn('git', [
  //   'config',
  //   '-l',
  // ])
  //
  // console.log(status)
}
