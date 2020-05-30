const path = require('path')
const { ...voca } = require('voca')
const {
  licenses,
  resolveLicenseFile,
} = require('./lib/license')
const {
  moduleType,
  projectTypes,
  defaultPackagePath,
  defaultProjectType,
  defaultProjectUrl,
  defaultLicense,
  defaultVersion,
} = require('./lib/config')
const UrlParser = require('./lib/parser/UrlParser')
const { CommandRunner } = require('./lib/CommandRunner')

const isNewProject = moduleType === 'project'
const url = new UrlParser()
const always = true

module.exports = {
  templateData () {
    return {
      year: new Date().getFullYear(),
      licenseFile: resolveLicenseFile(this.answers.license),
    }
  },
  transformerOptions: {
    context: {
      voca,
    },
  },
  prompts () {
    return [
      {
        name: 'type',
        message: 'Project type',
        type: 'list',
        choices: projectTypes,
        default: defaultProjectType,
        when: isNewProject,
      },
      {
        name: 'name',
        message: `${voca.capitalize(moduleType)} name`,
        default: this.outFolder,
        filter: val => {
          const name = val.toLowerCase()
          return !isNewProject ? `${defaultPackagePath.split('/').pop()}/${name}` : name
        },
      },
      {
        name: 'description',
        message: `${voca.capitalize(moduleType)} description`,
        default ({ name }) {
          return `${name} ${moduleType}`
        },
      },
      {
        name: 'version',
        message: 'Project version',
        default: defaultVersion,
        when: isNewProject,
      },
      {
        name: 'author',
        message: 'Author name',
        default: this.gitUser.name,
      },
      {
        name: 'email',
        message: 'Author email',
        default: this.gitUser.email,
      },
      {
        name: 'origin',
        message: 'Git origin URL',
        when: isNewProject,
      },
      {
        name: 'license',
        message: 'Choose a license',
        type: 'list',
        choices: licenses,
        default: defaultLicense,
      },
    ]
  },
  actions () {
    const version = this.answers.version || defaultVersion
    const origin = this.answers.origin || defaultProjectUrl
    const directory = !isNewProject ? path.join(defaultPackagePath, this.outFolder) : this.outFolder
    origin && url.parse(origin, directory)
    const context = {
      ...this.answers,
      version,
      url,
      isNewProject,
    }
    this.sao.opts.outDir = path.resolve(this.outDir.replace(this.outFolder, ''), directory)

    const actions = []
    const commonActions = [
      {
        type: 'add',
        files: '**',
      },
      {
        type: 'move',
        patterns: {
          '_package.json': 'package.json',
        },
      },
      {
        type: 'modify',
        files: 'package.json',
        handler: data => require('./lib/handlers/updatePkg')(data, context),
      },
    ]
      .map(action => ({
        ...action,
        templateDir: 'templates/common',
      }))

    const configurationActions = [
      {
        type: 'add',
        files: '**',
        filters: {
          'lerna.json': this.answers.type === 'Monorepo',
        },
      },
      {
        type: 'move',
        patterns: {
          'commitlintrc.ejs': '.commitlintrc.js',
          'editorconfig.ejs': '.editorconfig',
          'eslintignore.ejs': '.eslintignore',
          'eslintrc.js.ejs': '.eslintrc.js',
          'gitignore.ejs': '.gitignore',
          'prettierignore.ejs': '.prettierignore',
          'prettierrc.js.ejs': '.prettierrc.js',
        },
      },
      {
        type: 'modify',
        files: 'lerna.json',
        handler: data => require('./lib/handlers/updateLerna')(data, context),
      },
    ]
      .map(action => ({
        ...action,
        templateDir: 'templates/configuration',
      }))

    actions.push(...commonActions)
    if (isNewProject) {
      actions.push(...configurationActions)
    }
    return actions
  },
  async completed () {
    const runner = new CommandRunner(this.sao.opts.outDir)
    const yarnFlags = [
      '-D',
    ]
    const devDependencies = []

    const yarnInstal = async () => {
      if (this.answers.type === 'Monorepo') {
        yarnFlags.push('-W')
        devDependencies.push('lerna')
      }
      if (this.sao.opts.quiet) {
        yarnFlags.push('--silent')
      }
      if (isNewProject) {
        devDependencies.push(
          'husky',
          'lint-staged',
          'eslint',
          '@codeconv/eslint-config-base',
          '@commitlint/cli',
          '@commitlint/config-conventional',
          'format-package',
          'prettier',
        )
      }

      if (devDependencies.length > 0) {
        return runner.run(`yarn add ${[
          ...yarnFlags,
          ...devDependencies,
        ].join(' ')}`)
      }
    }

    const gitCommit = async (type) => {
      const commitTypes = [
        'init',
        'done',
      ]
      const commitMsg = {
        init: `chore${!isNewProject ? `(${this.answers.name})` : ''}: init`,
        done: `chore${!isNewProject ? `(${this.answers.name})` : ''}: ${devDependencies.length > 0 ? 'add development dependencies and' : ''} apply code style`,
      }

      if (!commitTypes.includes(type)) {
        return
      }

      const gitStatus = await runner.spawn('git status --porcelain')

      if (gitStatus.messages.length > 0) {
        await runner.run('git add .')
        await runner.run(`git commit${this.sao.opts.quiet ? ' --quiet' : ''} -m "${commitMsg[type]}"`)
      }
    }

    isNewProject &&
      await runner.run(`git init${this.sao.opts.quiet ? ' --quiet' : ''}`)
    isNewProject && this.answers.origin &&
      await runner.run(`git remote add origin ${url.remote}`)
    isNewProject &&
      await gitCommit('init')
    always &&
      await yarnInstal()
    isNewProject &&
      await runner.run('npx eslint --ext js,md . --fix')
    always &&
      await gitCommit(isNewProject ? 'done' : 'init')
  },
}
