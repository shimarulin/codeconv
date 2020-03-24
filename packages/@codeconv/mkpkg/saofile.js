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
const execute = require('./lib/execute')
const UrlParser = require('./lib/parser/UrlParser')

const isNewProject = moduleType === 'project'
const url = new UrlParser()

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
    const context = {
      ...this.answers,
      version: this.answers.version || defaultVersion,
      origin: this.answers.origin || defaultProjectUrl,
      directory: !isNewProject ? path.join(defaultPackagePath, this.outFolder) : this.outFolder,
    }
    this.sao.opts.outDir = path.resolve(this.outDir.replace(this.outFolder, ''), context.directory)

    context.origin && url.parse(context.origin, context.directory)

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
        handler: data => require('./lib/updatePkg')(data, context, url),
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
        handler: data => require('./lib/updateLerna')(data, context),
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
    const exec = execute.bind(null, this.sao.opts.outDir)
    const yarnFlags = [
      '-D',
    ]
    const devDependencies = [
      'husky',
      'lint-staged',
    ]

    if (isNewProject) {
      await exec('git', [
        'init',
      ],
      (status) => `Git init ${status}${status === 'started' ? '...' : ''}`)

      if (this.answers.origin) {
        await exec('git', [
          'remote',
          'add',
          'origin',
          url.remote,
        ],
        (status) => `Git remote add origin ${url.remote} ${status}${status === 'started' ? '...' : ''}`)
      }
    }

    if (this.answers.type === 'Monorepo') {
      yarnFlags.push('-W')
    }
    await exec('yarn', [
      'add',
      ...yarnFlags,
      ...devDependencies,
    ],
    (status, code, messages) => {
      switch (status) {
        case 'started':
          return 'Install development dependencies...'
        case 'succeed':
          return 'Development dependencies installed'
        case 'failed':
          // eslint-disable-next-line no-useless-escape
          return `Installation development dependencies failed due to error:\n\s\s> Exit code: ${code},\n\s\s> Messages: ${messages.join('\n\s\s\s\s> ')}`
      }
    })

    if (isNewProject) {
      await exec('git', [
        'add',
        '.',
      ],
      (status) => `Add files to git ${status}${status === 'started' ? '...' : ''}`)

      await exec('git', [
        'commit',
        '-m',
        'chore: init',
      ],
      (status) => `Commit changes to git ${status}${status === 'started' ? '...' : ''}`)
    }
  },
}
