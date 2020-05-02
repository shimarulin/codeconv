type AddCommandParsed = {
  name: string;
}

export const getEnvironmentInfo = async (): Promise<AddCommandParsed> => {
  return {
    name: 'test',
  }
}
