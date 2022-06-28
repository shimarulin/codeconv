import type { ArgumentsCamelCase, CommandModule } from 'yargs'
import inquirer from 'inquirer'
import { resolveModuleList } from '@codeconv/packages-resolver'
import { getGitConfig, GitConfig } from '@codeconv/git-config-parser'

const { prompt } = inquirer

export interface TemplateArgs {
  name?: string
}

export interface Context {
  gitConfig: GitConfig
}

export type TemplateRender = (args: TemplateArgs, ctx: Context) => Promise<void>

export interface TemplateModule {
  name: string
  handler: TemplateRender
  describe?: string
}

export interface CreateCommandArguments {
  name?: string;
}

const validateTemplateModule = (templateModule: TemplateModule): boolean => {
  return 'name' in templateModule &&
    ('handler' in templateModule && typeof templateModule.handler === 'function')
}

async function getModules (global?: boolean) {
  return resolveModuleList<TemplateModule>([
    '**/@codeconv/template-*',
    '**/codeconv-plugin-*',
  ], global)
    .then((resolvedModules) => resolvedModules.filter(validateTemplateModule))
}

const commandModule: CommandModule = {
  command: 'create [name]',
  describe: 'Create standard project or package from template',
  builder: {},
  handler: async (args: ArgumentsCamelCase<CreateCommandArguments>) => {
    /**
     * if (!name) {
     *   input name >
     *     if (ctx.project) {
     *       message for package in project
     *     } else {
     *       message for project
     *     }
     * }
     * if (ctx.project) {
     *   select namespace if ctx.namespaces.length > 1
     * }
     *
     * */

    /**
     * 0. [ ] get context
     * 1. [x] find templates by pattern ['**\/@codeconv/template-*', '**\/codeconv-template-*']
     * 2. [ ] if (context.monorepo) { select package template } else { select project template }
     * 3. [x] pass control to the template module
     *
     * template module uses generators:
     *  - generator-manifest (package.json) - can be extended for template, ask questions:
     *    - name
     *    - description
     *    - license
     *  - generator-license, ask questions:
     *    - license (or reused from 'generator-manifest')
     *  - generator-readme, ask questions:
     *    - name (or reused from 'generator-manifest')
     *    - description (or reused from 'generator-manifest')
     * */
    const [
      gitConfig,
    ] = await Promise.all([
      getGitConfig(),
    ])

    const ctx: Context = {
      gitConfig,
    }

    // TODO: get context
    const [
      templateModules,
    ] = await Promise.all([
      getModules(false),
    ])

    if (templateModules.length === 1) {
      await templateModules[0].handler(args, ctx)
    } else if (templateModules.length > 1) {
      await prompt<{template: TemplateModule}>([
        {
          name: 'template',
          message: 'Select the template',
          type: 'list',
          choices: templateModules.map((templateModule) => {
            return {
              name: `${templateModule.name} > ${templateModule.describe || ''}`,
              value: templateModule,
            }
          }),
        },
      ]).then(({ template }) => {
        return template.handler(args, ctx)
      })
    } else {
      console.log('No template installed')
    }
  },
}

export default commandModule
