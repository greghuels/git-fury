import executeGit, { ExecuteGitOptions } from './helpers/executeGit';
import listBranches from './helpers/listBranches';

export default class BranchDescription {
  private readonly configSetting: string;

  constructor(
    specifiedBranch: string,
    private readonly executeGitOptions: ExecuteGitOptions,
  ) {
    this.configSetting = `branch.${specifiedBranch.trim()}.description`;
  }

  show = (): Promise<number> =>
    executeGit(['config', this.configSetting], this.executeGitOptions)

  set = async (description: string): Promise<number | undefined> => {
    const code = await executeGit(['config', this.configSetting, description], this.executeGitOptions);
    if (!code && !this.executeGitOptions.dryRun) {
      listBranches(this.executeGitOptions.log);
    }
    return code;
  }

  remove = async (): Promise<number> => {
    const code = await executeGit(['config', '--unset', this.configSetting], this.executeGitOptions);
    if (!code && !this.executeGitOptions.dryRun) {
      listBranches(this.executeGitOptions.log);
    }
    return code;
  }
}