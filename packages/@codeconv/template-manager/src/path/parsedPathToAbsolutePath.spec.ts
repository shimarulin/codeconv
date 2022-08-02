import { parsedPathToAbsolutePath } from './parsedPathToAbsolutePath'

describe('formatParsedPath', () => {
  test('format correct parsed path', () => {
    expect(parsedPathToAbsolutePath({
      root: '/tmp/files',
      dir: './others',
      name: 'example',
      base: 'example.txt',
      ext: '.txt',
    })).toBe('/tmp/files/others/example.txt')
  })
})
