import { getPathListFromStringOrURLList } from './getPathListFromStringOrURLList'

describe('getPathListFromStringOrURLList', () => {
  test('get path list from path string and URL', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
    const pathList: string[] = getPathListFromStringOrURLList([
      '/tmp/a',
      'file:///tmp/b',
      new URL('./c', 'file:///tmp/'),
    ])

    expect(pathList).toMatchObject([
      '/tmp/a',
      '/tmp/b',
      '/tmp/c',
    ])
  })
})
