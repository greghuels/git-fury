import { FuryOptions } from "../../fury.d.ts";
import { exec } from "../../helpers/subprocess.ts";
import { BranchService } from "../BranchService/BranchService.ts";
import { GitService } from "../GitService/GitService.ts";

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

  private getConfigSetting = (branch: string) => `branch.${branch}.description`

  getBranchDescription = async (branch: string): Promise<string> => {
    try {
      const { code, output, error } = await exec('git', 'config', `branch.${branch}.description`);
      if (!code) {
        return output.trim();
      } else if (code === 1 && !error) {
        return '';
      } else {
        console.error(error);
        Deno.exit(code);
      }
    } catch (e) {
      console.error(e);
      Deno.exit(1);
    }
  }

  showBranchDescription = (branch: string): Promise<number> =>
    this.gitService.executeGit(['config', this.getConfigSetting(branch)])

  setBranchDescription = async (branch: string, description: string): Promise<number> => {
    const code = await this.gitService.executeGit(['config', this.getConfigSetting(branch), description]);
    if (!code && !this.options.dryRun) {
      await this.branchService.listBranches();
    }
    return code;
  }

  removeBranchDescription = async (branch: string): Promise<number> => {
    const code = await this.gitService.executeGit(['config', '--unset', this.getConfigSetting(branch)]);
    if (!code && !this.options.dryRun) {
      await this.branchService.listBranches();
    }
    return code;
  }
}