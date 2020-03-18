const { getUrlType, getHostFromUrl, getUserFromUrl, getRepoNameFromUrl } = require('../../lib/parseRepositoryUrl')

describe('Get type of repository URL', () => {
  test('URL isn\'t a string', async () => {
    expect(getUrlType(undefined)).toBeUndefined()
  })
  test('Git over SSH', async () => {
    expect(getUrlType('git@github.com:username/package.git')).toEqual('ssh')
  })
  test('Git over HTTPS', async () => {
    expect(getUrlType('git+https://github.com/username/package.git')).toEqual('https')
  })
  test('Git over HTTPS without prefix', async () => {
    expect(getUrlType('https://github.com/username/package.git')).toEqual('https')
  })
  test('repository link', async () => {
    expect(getUrlType('https://github.com/username/package')).toEqual('link')
  })
  test('unknown repository link', async () => {
    expect(getUrlType('github.com/username/package')).toEqual('unknown')
  })
})

describe('Get host of repository URL', () => {
  test('Git over SSH', async () => {
    expect(getHostFromUrl('git@github.com:username/package.git')).toEqual('github.com')
  })
  test('Git over HTTPS', async () => {
    expect(getHostFromUrl('git+https://github.com/username/package.git')).toEqual('github.com')
  })
  test('repository link', async () => {
    expect(getHostFromUrl('https://github.com/username/package')).toEqual('github.com')
  })
  test('unknown repository link', async () => {
    expect(getHostFromUrl('github.com/username/package')).toEqual('github.com')
  })
})

describe('Get user from repository URL', () => {
  test('Git over SSH', async () => {
    expect(getUserFromUrl('git@github.com:username/package.git')).toEqual('username')
  })
  test('Git over HTTPS', async () => {
    expect(getUserFromUrl('git+https://github.com/username/package.git')).toEqual('username')
  })
  test('repository link', async () => {
    expect(getUserFromUrl('https://github.com/username/package')).toEqual('username')
  })
  test('unknown repository link', async () => {
    expect(getUserFromUrl('github.com/username/package')).toEqual('username')
  })
})

describe('Get repository name from repository URL', () => {
  test('Git over SSH', async () => {
    expect(getRepoNameFromUrl('git@github.com:username/package.git')).toEqual('package')
  })
  test('Git over HTTPS', async () => {
    expect(getRepoNameFromUrl('git+https://github.com/username/package.git')).toEqual('package')
  })
  test('Git over HTTPS with dots', async () => {
    expect(getRepoNameFromUrl('https://github.com/username/package.github.io.git')).toEqual('package.github.io')
  })
  test('repository link', async () => {
    expect(getRepoNameFromUrl('https://github.com/username/package')).toEqual('package')
  })
  test('unknown repository link', async () => {
    expect(getRepoNameFromUrl('github.com/username/package')).toEqual('package')
  })
  test('repository link with dots', async () => {
    expect(getRepoNameFromUrl('github.com/username/package.github.io')).toEqual('package.github.io')
  })
})
