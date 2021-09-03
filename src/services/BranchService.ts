import { colors } from "../../deps.ts";
import getShorthandBranchCharacter from "../helpers/getShorthandBranchCharacter.ts";

import BranchRepository from "../repositories/BranchRepository.ts";

export class BranchService {
  private readonly log: typeof console.log;

  constructor(log: typeof console.log) {
    this.log = log;
  }

  async getCharToBranchMap() {
    const branches = await BranchRepository.getAvailableBranches();
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
    const currentBranch = await BranchRepository.getCurrentBranch();
    const charToBranchMap = await this.getCharToBranchMap();
    for (const entry of Object.entries(charToBranchMap)) {
      const [ch, branch] = entry;
      this.log(await this.getBranchListing(ch, branch, currentBranch));
    }
  }

  private async getBranchListing(
    ch: string,
    branch: string,
    currentBranch: string,
  ): Promise<string> {
    const isCurrentBranch = branch === currentBranch;
    const desc = await BranchRepository.getBranchDescription(branch);
    const prefixText = isCurrentBranch ? "* " : "  ";
    const branchColor = isCurrentBranch ? colors.green : colors.reset;
    return colors.reset(prefixText) + colors.yellow(`(${ch})`) +
      branchColor(` ${branch}`) + colors.reset(colors.dim(` ${desc}`));
  }
}
