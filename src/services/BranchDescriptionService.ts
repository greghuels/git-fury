import { FuryOptions } from "../fury.d.ts";
import { BranchService } from "./BranchService.ts";
import { GitService } from "./GitService.ts";

export default class BranchDescriptionService {
  private readonly options: FuryOptions;
  private readonly gitService: GitService;
  private readonly branchService: BranchService;

  constructor(
    options: FuryOptions,
    gitService: GitService,
    branchService: BranchService,
  ) {
    this.options = options;
    this.gitService = gitService;
    this.branchService = branchService;
  }

  private getConfigSetting = (branch: string) => `branch.${branch}.description`;

  showBranchDescription = (branch: string): Promise<number> =>
    this.gitService.executeGit(["config", this.getConfigSetting(branch)]);

  setBranchDescription = async (
    branch: string,
    description: string,
  ): Promise<number> => {
    const code = await this.gitService.executeGit([
      "config",
      this.getConfigSetting(branch),
      description,
    ]);
    if (!code && !this.options.dryRun) {
      await this.branchService.listBranches();
    }
    return code;
  };

  removeBranchDescription = async (branch: string): Promise<number> => {
    const code = await this.gitService.executeGit([
      "config",
      "--unset",
      this.getConfigSetting(branch),
    ]);
    if (!code && !this.options.dryRun) {
      await this.branchService.listBranches();
    }
    return code;
  };
}
