import executeGit, { ExecuteGitOptions } from './helpers/executeGit.ts';
import listBranches from './helpers/listBranches.ts';

export default class BranchDescription {
  private readonly configSetting: string;
  private readonly executeGitOptions: ExecuteGitOptions;

  constructor(
    specifiedBranch: string,
    executeGitOptions: ExecuteGitOptions,
  ) {
    this.configSetting = `branch.${specifiedBranch.trim()}.description`;
    this.executeGitOptions = executeGitOptions;
  }

  show = (): Promise<number> =>
    executeGit(['config', this.configSetting], this.executeGitOptions)

  set = async (description: string): Promise<number> => {
    const code = await executeGit(['config', this.configSetting, description], this.executeGitOptions);
    if (!code && !this.executeGitOptions.dryRun) {
      await listBranches(this.executeGitOptions.log);
      return 0;
    }
    return code;
  }

  remove = async (): Promise<number> => {
    const code = await executeGit(['config', '--unset', this.configSetting], this.executeGitOptions);
    if (!code && !this.executeGitOptions.dryRun) {
      await listBranches(this.executeGitOptions.log);
    }
    return code;
  }
}