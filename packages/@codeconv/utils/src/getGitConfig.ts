import { command } from 'execa'

type AddCommandParsed = {
  name: string;
}

export const getGitUser = async (cwd: string = process.cwd()): Promise<AddCommandParsed> => {
  const config = await command('git config -l', {
    cwd,
  })
  return {
    name: 'test',
  }
}
