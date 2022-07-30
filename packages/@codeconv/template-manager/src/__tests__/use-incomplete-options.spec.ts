import { FileManager } from '../FileManager'

describe('Use incomplete options', () => {
  test('Empty input dirs', () => {
    expect(() => {
      return new FileManager()
        .writeToDir('/tmp/asd123').process()
    }).toThrow('No input directory specified.')
  })

  test('Empty output dir', () => {
    expect(() => {
      return new FileManager()
        .readFromDir('/tmp/asd123').process()
    }).toThrow('No output directory specified.')
  })
})
