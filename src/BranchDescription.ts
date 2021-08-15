import { FuryOptions } from "./fury.d.ts";
import { ServiceContainer } from "./fury.d.ts";
import executeGit from './helpers/executeGit.ts';

export default class BranchDescription {
  private readonly configSetting: string;
  private readonly options: FuryOptions;
  private readonly services: ServiceContainer;

  constructor(
    specifiedBranch: string,
    options: FuryOptions,
    services: ServiceContainer,
  ) {
    this.configSetting = `branch.${specifiedBranch.trim()}.description`;
    this.options = options;
    this.services = services;
  }

  show = (): Promise<number> =>
    executeGit(['config', this.configSetting], this.options, this.services)

  set = async (description: string): Promise<number> => {
    const code = await executeGit(['config', this.configSetting, description], this.options, this.services);
    if (!code && !this.options.dryRun) {
      const { branchService } = this.services;
      await branchService.listBranches();
      return 0;
    }
    return code;
  }

  remove = async (): Promise<number> => {
    const code = await executeGit(['config', '--unset', this.configSetting], this.options, this.services);
    if (!code && !this.options.dryRun) {
      const { branchService } = this.services;
      await branchService.listBranches();
    }
    return code;
  }
}