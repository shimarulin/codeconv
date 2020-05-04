import { GitConfig, User } from '@codeconv/git-config-parser'
import { PackagesPath } from '@codeconv/package-resolver'

export interface PromptsContext {
  user: User;
  path: PackagesPath;
  origin?: string;
  // year: number;
}

export const setupPrompts = (gitConfig: GitConfig, packagesPatch: PackagesPath): PromptsContext => {
  return {
    user: {
      ...gitConfig.user,
    },
    path: {
      ...packagesPatch,
    },
    origin: gitConfig.remote?.origin.url
    // year: new Date().getFullYear(),
  }
}
