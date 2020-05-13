import { resolve } from 'path'
import { Arguments, Options } from 'yargs'
import { getGitConfig, GitConfig } from '@codeconv/git-config-parser'
import { GitUrlParser } from '@codeconv/git-url-parser'
import { Package, PackageDescriptor, resolvePackages } from '@codeconv/package-resolver'
import { licenseMap } from '@codeconv/license'
import { runPrompts, PromptDefaults, PromptOverrides, PromptData, Answers } from './runPrompts'
import { runActions, ActionData } from './runActions'

export interface AddCommandArguments {
  pkg?: string;
}

interface ConfigContext {
  config: {
    year: number;
    git: GitConfig;
    packages: PackageDescriptor[];
    rootPkg?: PackageDescriptor;
  };
}

interface PromptContext extends ConfigContext {
  prompt: {
    defaults: PromptDefaults;
    overrides: PromptOverrides;
    data: PromptData;
  };
}

interface AnswersContext extends PromptContext {
  answers: Answers;
}

interface ActionContext extends AnswersContext {
  action: {
    target: string;
    data: ActionData;
  };
}

interface Context {
  config: {
    year: number;
    git: GitConfig;
    packages: PackageDescriptor[];
    rootPkg?: PackageDescriptor;
  };
  prompt?: {
    defaults: PromptDefaults;
    overrides: PromptOverrides;
    data: PromptData;
  };
  action?: {
    target: string;
    data: ActionData;
  };
}

interface Ctx {
  config: {
    year: number;
    git: GitConfig;
    packages: PackageDescriptor[];
    rootPkg?: PackageDescriptor;
  };
  prompt: {
    defaults: PromptDefaults;
    overrides: PromptOverrides;
    context: PromptData;
  };
  action: ActionData;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const pipeline = (...list: Array<(ctx?: Context) => Promise<Context>>) => (acc?: Context | Promise<Context>) => list.reduce((acc, fn) => acc.then(fn), Promise.resolve(acc))

export const command = 'create [pkg]'
export const describe = 'Create standard project or package from template'

export const builder: { [key: string]: Options } = {}

export const handler = async ({ pkg }: Arguments<AddCommandArguments>): Promise<void> => {
  const getConfig = async (): Promise<ConfigContext> => {
    const year = new Date().getFullYear()
    const [
      git,
      packages,
    ] = await Promise.all([
      getGitConfig(),
      resolvePackages(),
    ])

    const rootPkg: PackageDescriptor | undefined = packages.length > 0 ? packages[packages.length - 1] : undefined

    return {
      config: {
        git,
        packages,
        rootPkg,
        year,
      },
    }
  }

  const beforePrompts = (ctx: ConfigContext): PromptContext => {
    const data: PromptData = {
      namespaces: ctx.config.rootPkg?.manifest.workspaces?.map(workspacePath => {
        const parts = workspacePath
          .replace('/*', '')
          .split('/')
        const ns = parts.pop()
        return ns || ''
      }),
    }

    const overrides: PromptOverrides = {
      type: ctx.config.rootPkg ? 'package' : undefined,
      origin: ctx.config.rootPkg?.manifest?.repository.url || ctx.config.git.remote?.origin.url,
      namespace: Array.isArray(data.namespaces) && data.namespaces.length === 1 ? data.namespaces[0] : undefined,
      // version: '0.1.6',
    }

    const defaults: PromptDefaults = {
      name: pkg,
      author: ctx.config.git.user.name,
      email: ctx.config.git.user.email,
      license: 'MIT',
      version: '1.0.0',
    }

    return {
      ...ctx,
      prompt: {
        data,
        defaults,
        overrides,
      },
    }
  }

  const getAnswers = async (ctx: PromptContext): Promise<AnswersContext> => {
    const answers = await runPrompts(ctx.prompt.overrides, ctx.prompt.defaults, ctx.prompt.data)
    return {
      ...ctx,
      answers,
    }
  }

  const beforeActions = (ctx: AnswersContext): ActionContext => {
    const licenseSource = licenseMap[ctx.answers.license]
    const gitUrl = new GitUrlParser(ctx.answers.origin)
    const target = ctx.config.rootPkg
      ? resolve(ctx.config.rootPkg?.path, 'packages', ctx.answers.namespace, (pkg || ctx.answers.name))
      : resolve(process.cwd(), (pkg || ctx.answers.name))
    const manifest: Package = {
      name: ctx.answers.namespace ? `${ctx.answers.namespace}/${ctx.answers.name}` : ctx.answers.name,
      version: ctx.answers.version,
      description: ctx.answers.description,
      license: ctx.answers.license,
      private: !ctx.answers.publish ? true : undefined,
      publishConfig: ctx.answers.publish ? {
        access: 'public',
      } : undefined,
      repository: {
        ...gitUrl.repository,
      },
      bugs: {
        ...gitUrl.bugs,
      },
      homepage: gitUrl.homepage,
      author: `${ctx.answers.author} <${ctx.answers.email}>`,
    }

    const license = {
      ...licenseSource,
      licenseText: licenseSource.licenseText
        .replace('<year>', ctx.config.year.toString())
        .replace('<copyright holders>', ctx.answers.author),
    }

    return {
      ...ctx,
      action: {
        data: {
          manifest,
          license,
        },
        target,
      },
    }
  }

  // const year = new Date().getFullYear()
  // const [
  //   gitConfig,
  //   packages,
  // ] = await Promise.all([
  //   getGitConfig(),
  //   resolvePackages(),
  // ])
  //
  // const rootPkg: PackageDescriptor | undefined = packages.length > 0 ? packages[packages.length - 1] : undefined
  //
  // const promptContext: PromptData = {
  //   namespaces: rootPkg?.manifest.workspaces?.map(workspacePath => {
  //     const parts = workspacePath
  //       .replace('/*', '')
  //       .split('/')
  //     const ns = parts.pop()
  //     return ns || ''
  //   }),
  // }
  //
  // const overrides: PromptOverrides = {
  //   type: rootPkg ? 'package' : undefined,
  //   origin: rootPkg?.manifest?.repository.url || gitConfig.remote?.origin.url,
  //   namespace: Array.isArray(promptContext.namespaces) && promptContext.namespaces.length === 1 ? promptContext.namespaces[0] : undefined,
  //   // version: '0.1.6',
  // }
  // const defaults: PromptDefaults = {
  //   name: pkg,
  //   author: gitConfig.user.name,
  //   email: gitConfig.user.email,
  //   license: 'MIT',
  //   version: '1.0.0',
  // }
  //
  // const answers = await runPrompts(overrides, defaults, promptContext)
  //
  // const license = licenseMap[answers.license]
  // const gitUrl = new GitUrlParser(answers.origin)
  // const target = rootPkg
  //   ? resolve(rootPkg?.path, 'packages', answers.namespace, (pkg || answers.name))
  //   : resolve(process.cwd(), (pkg || answers.name))
  //
  // const actionContext: ActionContext = {
  //   target,
  //   manifest: {
  //     name: answers.namespace ? `${answers.namespace}/${answers.name}` : answers.name,
  //     version: answers.version,
  //     description: answers.description,
  //     license: answers.license,
  //     private: !answers.publish ? true : undefined,
  //     publishConfig: answers.publish ? {
  //       access: 'public',
  //     } : undefined,
  //     repository: {
  //       ...gitUrl.repository,
  //     },
  //     bugs: {
  //       ...gitUrl.bugs,
  //     },
  //     homepage: gitUrl.homepage,
  //     author: `${answers.author} <${answers.email}>`,
  //   },
  //   license: {
  //     ...license,
  //     licenseText: license.licenseText
  //       .replace('<year>', year.toString())
  //       .replace('<copyright holders>', answers.author),
  //   },
  // }
  //
  // await runActions(actionContext)
}
