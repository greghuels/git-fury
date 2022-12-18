import { colors } from "../../deps.ts";
import { FuryOptions } from "../types.ts";
import { _internals } from "../helpers/branchHelpers.ts";

import { GitService } from "./GitService.ts";

const getShorthandBranchCharacter = (index: number): string => {
  if (index >= 26) {
    const moreSignificantDigit = Math.floor(index / 26) - 1;
    const remainder = Math.floor(index % 26);
    return `${getShorthandBranchCharacter(moreSignificantDigit)}${
      getShorthandBranchCharacter(remainder)
    }`;
  } else {
    return String.fromCharCode(97 + index);
  }
};

export class BranchService {
  private readonly options: FuryOptions;
  private readonly log: typeof console.log;
  private readonly gitService: GitService;

  constructor(
    options: FuryOptions,
    log: typeof console.log,
    gitService: GitService,
  ) {
    this.options = options;
    this.log = log;
    this.gitService = gitService;
  }

  private getBranchDescriptionConfigKey = (branch: string) =>
    `branch.${branch}.description`;

  async getCharToBranchMap() {
    const branches = await _internals.getAvailableBranches();
    let i = 0;
    return branches.reduce((acc, branch) => {
      if (branch) {
        acc[getShorthandBranchCharacter(i)] = branch;
        i += 1;
      }
      return acc;
    }, {} as Record<string, string>);
  }

  async listBranches() {
    const currentBranch = await _internals.getCurrentBranch();
    const charToBranchMap = await this.getCharToBranchMap();
    for (const [ch, branch] of Object.entries(charToBranchMap)) {
      this.log(await this.getBranchListing(ch, branch, currentBranch));
    }
  }

  private async getBranchListing(
    ch: string,
    branch: string,
    currentBranch: string,
  ): Promise<string> {
    const isCurrentBranch = branch === currentBranch;
    const desc = await _internals.getBranchDescription(branch);
    const prefixText = isCurrentBranch ? "* " : "  ";
    const branchColor = isCurrentBranch ? colors.green : colors.reset;
    return colors.reset(prefixText) + colors.yellow(`(${ch})`) +
      branchColor(` ${branch}`) + colors.reset(colors.dim(` ${desc}`));
  }

  showBranchDescription = (branch: string): Promise<number> =>
    this.gitService.executeGit([
      "config",
      this.getBranchDescriptionConfigKey(branch),
    ]);

  setBranchDescription = async (
    branch: string,
    description: string,
  ): Promise<number> => {
    const code = await this.gitService.executeGit([
      "config",
      this.getBranchDescriptionConfigKey(branch),
      description,
    ]);
    if (!code && !this.options.dryRun) {
      await this.listBranches();
    }
    return code;
  };

  removeBranchDescription = async (branch: string): Promise<number> => {
    const code = await this.gitService.executeGit([
      "config",
      "--unset",
      this.getBranchDescriptionConfigKey(branch),
    ]);
    if (!code && !this.options.dryRun) {
      await this.listBranches();
    }
    return code;
  };
}
