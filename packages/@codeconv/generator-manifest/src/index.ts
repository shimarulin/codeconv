export interface ManifestInput {
  name?: string
  version?: string
}

export interface Manifest {
  name: string
  version: string
}

export const generate = (input: ManifestInput): Manifest => {
  const name = input.name || 'name'
  const version = input.version || '1.0.0'

  return {
    name,
    version,
  }
}
