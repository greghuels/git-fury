import executeGit from './helpers/executeGit';
import getCurrentBranch from './helpers/getCurrentBranch';
import listBranches from './helpers/listBranches';

export default class BranchDescription {
  private readonly configSetting: string;

  constructor(specifiedBranch?: string) {
    const branch = specifiedBranch?.trim() || getCurrentBranch();
    this.configSetting = `branch.${branch}.description`;
  }

  show = (): Promise<number> =>
    executeGit(['config', this.configSetting])

  set = async (description: string): Promise<number | undefined> => {
    const code = await executeGit(['config', this.configSetting, description]);
    if (!code) {
      listBranches();
    }
    return code;
  }

  remove = async (): Promise<number> => {
    const code = await executeGit(['config', '--unset', this.configSetting]);
    if (!code) {
      listBranches();
    }
    return code;
  }
}