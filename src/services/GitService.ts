import { FuryOptions } from "../fury.d.ts";
import quote from "../helpers/quote.ts";
import { CharToBranchMap } from "../helpers/getCharToBranchMap.ts";
import { colors } from '../../deps.ts';
import { spawn } from "../helpers/subprocess.ts";
import getExpandedArgs from "../helpers/getExpandedArgs.ts";

export class GitService {
  private readonly options: FuryOptions;
  private readonly log: typeof console.log;

  constructor(options: FuryOptions, log: typeof console.log) {
    this.options = options;
    this.log = log;
  }

  getExpandedArgs(args: Array<string>, charToBranchMap: CharToBranchMap) {
    return getExpandedArgs(args, charToBranchMap);
  }

  async executeGit(expandedArgs: Array<string>) {
    if (this.options.dryRun) {
      this.printDryRun(expandedArgs);
      return 0;
    } else {
      return await spawn('git', ...expandedArgs);
    }
  }

  printDryRun(args: Array<string>) {
    const text = quote(['git', ...args]);
    this.log(colors.reset(colors.dim(text)));
  }
}