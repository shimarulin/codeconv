import { command } from 'execa'
import * as objectPath from 'object-path'

type GitConfig = {
  user: {
    name: string;
    email: string;
  };
}

export const getGitConfig = async (cwd: string = process.cwd()): Promise<GitConfig> => {
  const { stdout } = await command('git config -l', {
    cwd,
  })

  const cfg: GitConfig = {
    user: {
      name: '',
      email: '',
    },
  }

  stdout
    .trim()
    .split('\n')
    .map(str => str.split('='))
    .forEach(([
      path,
      value,
    ]) => {
      objectPath.set(cfg, path, value)
    })

  return cfg
}
