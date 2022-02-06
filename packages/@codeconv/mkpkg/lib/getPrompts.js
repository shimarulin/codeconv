const getPrompts = function ({
  projectTypes,
  defaultProjectType,
  licenses,
  defaultLicense,
  moduleType,
  isNewProject,
  defaultPackagePath,
  defaultVersion,
}) {
  return [
    {
      name: 'type',
      message: 'Choose a project type',
      type: 'list',
      choices: projectTypes,
      default: defaultProjectType,
      when: isNewProject,
    },
    {
      name: 'name',
      message: `Name of the new ${moduleType}`,
      default: this.outFolder,
      filter: (val) => {
        const name = val.toLowerCase()
        return !isNewProject ? `${defaultPackagePath.split('/').pop()}/${name}` : name
      },
    },
    {
      name: 'description',
      message: `How would you describe the new ${moduleType}`,
      default ({ name }) {
        return `${name} ${moduleType}`
      },
    },
    {
      name: 'version',
      message: 'What is project version',
      default: defaultVersion,
      when: isNewProject,
    },
    {
      name: 'author',
      message: 'What is your name?',
      default: this.gitUser.name,
    },
    {
      name: 'email',
      message: 'What is your email?',
      default: this.gitUser.email,
    },
    {
      name: 'origin',
      message: 'What the Git repository URL of this package?\nFor example:\n- "git@github.com:username/package.git"\n- "https://github.com/username/package.git"\n >',
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
}

module.exports = getPrompts
