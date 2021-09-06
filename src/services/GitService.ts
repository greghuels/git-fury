import { FuryOptions } from "../fury.d.ts";
import { colors } from "../../deps.ts";
import Subprocess from "../helpers/Subprocess.ts";
import getExpandedArgs from "../helpers/getExpandedArgs.ts";

export class GitService {
  private readonly options: FuryOptions;
  private readonly log: typeof console.log;

  constructor(options: FuryOptions, log: typeof console.log) {
    this.options = options;
    this.log = log;
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
      return await Subprocess.spawn("git", ...expandedArgs);
    }
  }

  printDryRun(args: Array<string>) {
    const text = ["git", ...args].join(" ");
    this.log(colors.reset(colors.dim(text)));
  }
}
