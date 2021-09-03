import { FuryOptions } from "../fury.d.ts";
import shellCommand from "../helpers/shellCommand.ts";
import { colors } from "../../deps.ts";
import { spawn } from "../helpers/subprocess.ts";
import getExpandedArgs from "../helpers/getExpandedArgs.ts";

export class GitService {
  private readonly options: FuryOptions;

  constructor(options: FuryOptions) {
    this.options = options;
  }

  getExpandedArgs(
    args: Array<string>,
    charToBranchMap: Record<string, string>,
  ) {
    return getExpandedArgs(args, charToBranchMap);
  }

  async executeGit(expandedArgs: Array<string>) {
    if (this.options.dryRun) {
      this.printDryRun(expandedArgs);
      return 0;
    } else {
      return await spawn("git", ...expandedArgs);
    }
  }

  printDryRun(args: Array<string>) {
    const text = shellCommand(["git", ...args]);
    console.log(colors.reset(colors.dim(text)));
  }
}
