export type UrlType = 'ssh' | 'https' | 'link' | 'unknown'

type UrlTypes = {
  SSH: 'ssh';
  HTTPS: 'https';
  LINK: 'link';
  UNKNOWN: 'unknown';
}

export interface Bugs {
  url: string;
}

export interface Repository {
  directory?: string;
  type: string;
  url: string;
}

const URL_TYPES: UrlTypes = {
  SSH: 'ssh',
  HTTPS: 'https',
  LINK: 'link',
  UNKNOWN: 'unknown',
}

const hasSubDir = (dirPath = ''): boolean => dirPath.split('/').length > 1

const getUrlType = (url: string): UrlType => (url.search('git@') !== -1 && URL_TYPES.SSH) ||
  (url.search(/\.git$/) !== -1 && URL_TYPES.HTTPS) ||
  (url.search(/^https/) !== -1 && URL_TYPES.LINK) ||
  URL_TYPES.UNKNOWN

const getHostFromUrl = (url: string, urlType: UrlType): string => {
  let match: RegExpExecArray | null
  switch (urlType) {
    case URL_TYPES.SSH:
      match = (/(?:@)([-_a-zA-Z0-9.]+)/).exec(url)
      return match ? match[1] : ''
    case URL_TYPES.HTTPS:
      match = (/(?:\/\/)([-_a-zA-Z0-9.]+)/).exec(url)
      return match ? match[1] : ''
    case URL_TYPES.LINK:
      match = (/(?:\/\/)([-_a-zA-Z0-9.]+)/).exec(url)
      return match ? match[1] : ''
    default:
      match = (/([-_a-zA-Z0-9.]+)/).exec(url)
      return match ? match[1] : ''
  }
}

const getOwnerFromUrl = (url: string, host: string): string => {
  const match: RegExpExecArray | null = new RegExp(`${host}[/:]([-_a-zA-Z0-9]+)`).exec(url)
  return match ? match[1] : ''
}

const getProjectFromUrl = (url: string, owner: string): string => {
  const match: RegExpExecArray | null = new RegExp(`${owner}/([-_a-zA-Z0-9.]+)`).exec(url)
  return match ? match[1].replace(/.git$/, '') : ''
}

export class GitUrlParser {
  private urlSource: string;
  private urlPath: string;
  private urlType: UrlType;
  private host: string;
  private owner: string;
  private project: string;

  constructor (url?: string, path?: string) {
    this.urlSource = ''
    this.urlPath = ''
    this.urlType = 'unknown'
    this.host = ''
    this.owner = ''
    this.project = ''

    if (url) {
      this.parse(url, path)
    }
  }

  parse (url: string, path?: string): void {
    this.urlSource = url
    this.urlPath = path || ''
    this.urlType = getUrlType(this.urlSource)

    this.host = getHostFromUrl(this.urlSource, this.urlType)
    this.owner = getOwnerFromUrl(this.urlSource, this.host)
    // TODO: rename according to https://github.com/conventional-changelog/conventional-changelog-config-spec/blob/master/versions/2.1.0/README.md#repository
    this.project = getProjectFromUrl(this.urlSource, this.owner)
  }

  get repository (): Repository {
    return {
      type: 'git',
      // TODO: Need to documented. This URL can be used by CI tools.
      // See https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#repositoryurl
      url: this.remote,
      directory: hasSubDir(this.urlPath) ? this.urlPath : undefined,
    }
  }

  get remote (): string {
    return `git@${this.host}:${this.owner}/${this.project}.git`
  }

  get homepage (): string {
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

  get bugs (): Bugs {
    return {
      url: `https://${this.host}/${this.owner}/${this.project}/issues`,
    }
  }
}
