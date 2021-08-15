import { FuryOptions } from "./fury.d.ts";
import { ServiceContainer } from "./fury.d.ts";

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
    this.services.gitService.executeGit(['config', this.configSetting])

  set = async (description: string): Promise<number> => {
    const code = await this.services.gitService.executeGit(['config', this.configSetting, description]);
    if (!code && !this.options.dryRun) {
      const { branchService } = this.services;
      await branchService.listBranches();
      return 0;
    }
    return code;
  }

  remove = async (): Promise<number> => {
    const code = await this.services.gitService.executeGit(['config', '--unset', this.configSetting]);
    if (!code && !this.options.dryRun) {
      const { branchService } = this.services;
      await branchService.listBranches();
    }
    return code;
  }
}