import { colors } from '../../../deps.ts';

import { FuryOptions } from "../../fury.d.ts";
import getCharToBranchMap from './getCharToBranchMap.ts'
import getCurrentBranch from "./getCurrentBranch.ts";
import getBranchDescription from "./getBranchDescription.ts";

export class BranchService {
  private readonly options: FuryOptions;
  private readonly log: typeof console.log;

  constructor(options: FuryOptions, log: typeof console.log) {
    this.options = options;
    this.log = log;
  }

  private async getBranchListing(ch: string, branch: string, currentBranch: string): Promise<string> {
    const isCurrentBranch = branch === currentBranch;
    const desc = await getBranchDescription(branch);
    const prefixText = isCurrentBranch ? '* ' : '  ';
    const branchColor = isCurrentBranch ? colors.green : colors.reset;
    return colors.reset(prefixText) + colors.yellow(`(${ch})`) + branchColor(` ${branch}`) + colors.reset(colors.dim(` ${desc}`));
  }

  async listBranches() {
    const currentBranch = await getCurrentBranch();
    const charToBranchMap = await getCharToBranchMap();
    for (const entry of Object.entries(charToBranchMap)) {
      const [ch, branch] = entry;
      this.log(await this.getBranchListing(ch, branch, currentBranch));
    }
  }

  getBranchDescription(branch: string) {
    return getBranchDescription(branch);
  }

  getCharToBranchMap() {
    return getCharToBranchMap();
  }

  getCurrentBranch() {
    return getCurrentBranch()
  }
}