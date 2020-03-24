const URL_TYPES = {
  SSH: 'ssh',
  HTTPS: 'https',
  LINK: 'link',
  UNKNOWN: 'unknown',
}

const hasSubDir = (dirPath = '') => dirPath.split('/').length > 1

const getUrlType = (url) => (typeof url === 'string' || undefined) && ((url.search('git@') !== -1 && URL_TYPES.SSH) ||
  (url.search(/\.git$/) !== -1 && URL_TYPES.HTTPS) ||
  (url.search(/^https/) !== -1 && URL_TYPES.LINK) ||
  URL_TYPES.UNKNOWN)

const getHostFromUrl = (url, urlType) => {
  switch (urlType) {
    case URL_TYPES.SSH:
      return (/(?:@)([-_a-zA-Z0-9.]+)/).exec(url)[1]
    case URL_TYPES.HTTPS:
      return (/(?:\/\/)([-_a-zA-Z0-9.]+)/).exec(url)[1]
    case URL_TYPES.LINK:
      return (/(?:\/\/)([-_a-zA-Z0-9.]+)/).exec(url)[1]
    default:
      return (/([-_a-zA-Z0-9.]+)/).exec(url)[1]
  }
}

const getOwnerFromUrl = (url, host) => {
  return new RegExp(`${host}[/:]([-_a-zA-Z0-9]+)`)
    .exec(url)[1]
}

const getProjectFromUrl = (url, owner) => {
  return new RegExp(`${owner}/([-_a-zA-Z0-9.]+)`)
    .exec(url)[1]
    .replace(/.git$/, '')
}

class UrlParser {
  constructor (url, path = '') {
    this.urlSource = undefined
    this.urlPath = undefined
    this.urlType = undefined
    this.host = undefined
    this.owner = undefined
    this.project = undefined

    if (typeof url === 'string') {
      this.parse(url, path)
    }
  }

  parse (url, path = '') {
    if (typeof url !== 'string') {
      return
    }

    this.urlSource = url
    this.urlPath = path
    this.urlType = getUrlType(this.urlSource)

    this.host = getHostFromUrl(this.urlSource, this.urlType)
    this.owner = getOwnerFromUrl(this.urlSource, this.host)
    this.project = getProjectFromUrl(this.urlSource, this.owner)
  }

  get repository () {
    return {
      type: 'git',
      url: `https://${this.host}/${this.owner}/${this.project}.git`,
      directory: hasSubDir(this.urlPath) ? this.urlPath : undefined,
    }
  }

  get remote () {
    return `git@${this.host}:${this.owner}/${this.project}.git`
  }

  get homepage () {
    const projectPathPrefix = (this.host === 'github.com' && '/tree/master') ||
      (this.host === 'gitlab.com' && '/-/tree/master') ||
      (this.host === 'bitbucket.org' && '/src/master') ||
      '/-/tree/master'
    const projectPath = hasSubDir(this.urlPath)
      ? `${projectPathPrefix}/${this.urlPath}`
      : ''
    const readmeHash = this.host === 'github.com' ? '#readme' : ''
    return `https://${this.host}/${this.owner}/${this.project}${projectPath}${readmeHash}`
  }

  get bugs () {
    return {
      url: `https://${this.host}/${this.owner}/${this.project}/issues`,
    }
  }
}

module.exports = UrlParser
