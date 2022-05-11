import { execa } from 'execa'

interface YarnTreeItem {
  name: string,
  children: YarnTreeItem[],
  hint: null,
  color: string,
  depth: number
}

interface YarnList {
  type: 'tree',
  data: {
    type: 'list',
    trees: YarnTreeItem[]
  }
}

export const yarnList = async (pattern: string): Promise<string[]> => {
  const result = await execa('yarn', [
    'list',
    '--json',
    '--pattern',
    pattern,
  ])

  const tree = JSON.parse(result.stdout) as YarnList

  return tree.data.trees.map((item) => item.name)
}

// console.log((await yarnList('@codeconv/plugin|codeconv-plugin')))
