const UrlParser = require('../../lib/parser/UrlParser')

describe('Parse repository URL\'s', () => {
  const parsedUrl = {
    host: 'github.com',
    owner: 'username',
    project: 'package',
  }
  test('Git over SSH', () => {
    expect(new UrlParser('git@github.com:username/package.git')).toMatchObject(parsedUrl)
  })
  test('Git over HTTPS', () => {
    expect(new UrlParser('git+https://github.com/username/package.git')).toMatchObject(parsedUrl)
  })
  test('Git over HTTPS without prefix', () => {
    expect(new UrlParser('https://github.com/username/package.git')).toMatchObject(parsedUrl)
  })
  test('repository link', () => {
    expect(new UrlParser('https://github.com/username/package')).toMatchObject(parsedUrl)
  })
  test('repository link without protocol', () => {
    expect(new UrlParser('github.com/username/package')).toMatchObject(parsedUrl)
  })
})

describe('Get GitHub URL\'s', () => {
  const url = new UrlParser()
  url.parse('git@github.com:username/project.git')

  test('Git remote URL', () => {
    expect(url.remote).toBe('git@github.com:username/project.git')
  })

  test('Project homepage URL', () => {
    expect(url.homepage).toBe('https://github.com/username/project#readme')
  })

  test('Project bugs URL object', () => {
    expect(url.bugs).toEqual({
      url: 'https://github.com/username/project/issues',
    })
  })

  test('Project repository URL object', () => {
    expect(url.repository).toEqual({
      type: 'git',
      url: 'git@github.com:username/project.git',
    })
  })
})

describe('Get GitLab URL\'s', () => {
  const url = new UrlParser()
  url.parse('git@gitlab.com:username/project.git')

  test('Git remote URL', () => {
    expect(url.remote).toBe('git@gitlab.com:username/project.git')
  })

  test('Project homepage URL', () => {
    expect(url.homepage).toBe('https://gitlab.com/username/project')
  })

  test('Project bugs URL object', () => {
    expect(url.bugs).toEqual({
      url: 'https://gitlab.com/username/project/issues',
    })
  })

  test('Project repository URL object', () => {
    expect(url.repository).toEqual({
      type: 'git',
      url: 'git@gitlab.com:username/project.git',
    })
  })
})

describe('Get Bitbucket URL\'s', () => {
  const url = new UrlParser()
  url.parse('git@bitbucket.org:username/project.git')

  test('Git remote URL', () => {
    expect(url.remote).toBe('git@bitbucket.org:username/project.git')
  })

  test('Project homepage URL', () => {
    expect(url.homepage).toBe('https://bitbucket.org/username/project')
  })

  test('Project bugs URL object', () => {
    expect(url.bugs).toEqual({
      url: 'https://bitbucket.org/username/project/issues',
    })
  })

  test('Project repository URL object', () => {
    expect(url.repository).toEqual({
      type: 'git',
      url: 'git@bitbucket.org:username/project.git',
    })
  })
})

describe('Get unknown hosting URL\'s', () => {
  const url = new UrlParser()
  url.parse('git@git-example.com:username/project.git')

  test('Git remote URL', () => {
    expect(url.remote).toBe('git@git-example.com:username/project.git')
  })

  test('Project homepage URL', () => {
    expect(url.homepage).toBe('https://git-example.com/username/project')
  })

  test('Project bugs URL object', () => {
    expect(url.bugs).toEqual({
      url: 'https://git-example.com/username/project/issues',
    })
  })

  test('Project repository URL object', () => {
    expect(url.repository).toEqual({
      type: 'git',
      url: 'git@git-example.com:username/project.git',
    })
  })
})

describe('Get GitHub URL\'s for child package', () => {
  const url = new UrlParser()
  url.parse('git@github.com:username/project.git', 'packages/@test/output')

  test('Package homepage URL', () => {
    expect(url.homepage).toBe('https://github.com/username/project/tree/master/packages/@test/output#readme')
  })

  test('Package repository URL object', () => {
    expect(url.repository).toEqual({
      type: 'git',
      url: 'git@github.com:username/project.git',
      directory: 'packages/@test/output',
    })
  })
})

describe('Get GitLab URL\'s for child package', () => {
  const url = new UrlParser()
  url.parse('git@gitlab.com:username/project.git', 'packages/@test/output')

  test('Package homepage URL', () => {
    expect(url.homepage).toBe('https://gitlab.com/username/project/-/tree/master/packages/@test/output')
  })

  test('Package repository URL object', () => {
    expect(url.repository).toEqual({
      type: 'git',
      url: 'git@gitlab.com:username/project.git',
      directory: 'packages/@test/output',
    })
  })
})

describe('Get Bitbucket URL\'s for child package', () => {
  const url = new UrlParser()
  url.parse('git@bitbucket.org:username/project.git', 'packages/@test/output')

  test('Package homepage URL', () => {
    expect(url.homepage).toBe('https://bitbucket.org/username/project/src/master/packages/@test/output')
  })

  test('Package repository URL object', () => {
    expect(url.repository).toEqual({
      type: 'git',
      url: 'git@bitbucket.org:username/project.git',
      directory: 'packages/@test/output',
    })
  })
})

describe('Get unknown hosting URL\'s for child package', () => {
  const url = new UrlParser()
  url.parse('git@git-example.com:username/project.git', 'packages/@test/output')

  test('Package homepage URL', () => {
    expect(url.homepage).toBe('https://git-example.com/username/project/-/tree/master/packages/@test/output')
  })

  test('Package repository URL object', () => {
    expect(url.repository).toEqual({
      type: 'git',
      url: 'git@git-example.com:username/project.git',
      directory: 'packages/@test/output',
    })
  })
})
