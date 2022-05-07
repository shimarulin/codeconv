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

const yarnList = async (pattern: string): Promise<string[]> => {
  const { stdout } = await execa('yarn', [
    'list',
    '--json',
    '--pattern',
    pattern,
  ])

  const tree = JSON.parse(stdout) as YarnList

  return tree.data.trees.map((item) => item.name)
}

export const resolveCommandDirs = async (patterns: string[]): Promise<string[]> => {
  console.log((await yarnList('@codeconv/plugin|codeconv-plugin')))

  return []
}
