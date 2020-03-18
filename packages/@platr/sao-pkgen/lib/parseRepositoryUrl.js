const URL_TYPES = {
  SSH: 'ssh',
  HTTPS: 'https',
  LINK: 'link',
  UNKNOWN: 'unknown',
}

const getUrlType = (url) => (typeof url === 'string' || undefined) && ((url.search('git@') !== -1 && URL_TYPES.SSH) ||
  (url.search(/\.git$/) !== -1 && URL_TYPES.HTTPS) ||
  (url.search(/^https/) !== -1 && URL_TYPES.LINK) ||
  URL_TYPES.UNKNOWN)

const getHostFromUrl = (url) => {
  if (typeof url !== 'string') {
    return
  }
  const urlType = getUrlType(url)
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

const getUserFromUrl = (url) => {
  if (typeof url !== 'string') {
    return
  }
  const urlHost = getHostFromUrl(url)
  const re = new RegExp(`${urlHost}[/:]([-_a-zA-Z0-9]+)`)
  return re.exec(url)[1]
}

const getRepoNameFromUrl = (url) => {
  if (typeof url !== 'string') {
    return
  }
  const urlUser = getUserFromUrl(url)
  const re = new RegExp(`${urlUser}/([-_a-zA-Z0-9.]+)`)
  return re.exec(url)[1].replace(/.git$/, '')
}

const parseRepositoryUrl = (url) => {
  return {
    host: getHostFromUrl(url),
    owner: getUserFromUrl(url),
    project: getRepoNameFromUrl(url),
  }
}

module.exports = {
  getUrlType,
  getHostFromUrl,
  getUserFromUrl,
  getRepoNameFromUrl,
  parseRepositoryUrl,
}
