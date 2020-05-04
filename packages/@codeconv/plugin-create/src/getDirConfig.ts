type AddCommandParsed = {
  name: string;
}

export const getDirInfo = async (): Promise<AddCommandParsed> => {
  return {
    name: 'test',
  }
}
