import { getPathFromStringOrURL } from './getPathFromStringOrURL'

describe('getPathFromStringOrURL', () => {
  test('get path from path string', () => {
    expect(getPathFromStringOrURL('/tmp/a')).toBe('/tmp/a')
  })
  test('get path from file path string', () => {
    expect(getPathFromStringOrURL('file:///tmp/a')).toBe('/tmp/a')
  })
  test('get path from URL', () => {
    expect(getPathFromStringOrURL(new URL('./a', 'file:///tmp/'))).toBe('/tmp/a')
  })
})
