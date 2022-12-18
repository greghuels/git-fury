import { parse } from "../deps.ts";
import execBranchDescription, {
  shouldExecBranchDescription,
} from "./execBranchDescription.ts";
import execHelp, { shouldExecHelp } from "./execHelp.ts";
import execListBranches, {
  shouldExecListBranches,
} from "./execListBranches.ts";
import execShorthandGitCommand from "./execShorthandGitCommand.ts";
import execVersion, { shouldExecVersion } from "./execVersion.ts";
import { ServiceContainer } from "./types.ts";
import { FuryOptions } from "./types.ts";
import { BranchService } from "./services/BranchService.ts";
import { GitService } from "./services/GitService.ts";

const stripDryRunArgument = (originalArgs: Array<string>): Array<string> => {
  const args = [...originalArgs];
  const dryRun = parse(args)["dry-run"];
  const shouldExecDryRun = !!dryRun && dryRun !== "false" && dryRun !== "0";
  if (shouldExecDryRun) {
    const dryRunArgumentIndex = args.findIndex((arg) =>
      arg === "--dry-run" || arg.startsWith("--dry-run=")
    );
    if (dryRunArgumentIndex > -1) {
      args.splice(dryRunArgumentIndex, 1);
    } else {
      throw new Error(
        "Error parsing --dry-run argument. Please report this issue to https://github.com/greghuels/git-fury/issues",
      );
    }
  }
  return args;
};

const getDefaultServices = (options: FuryOptions): ServiceContainer => {
  const log = console.log;
  const gitService = new GitService(options, log);
  const branchService = new BranchService(options, log, gitService);
  return { log, gitService, branchService };
};

export default async function fury(
  originalArgs: Array<string>,
  customServices?: ServiceContainer,
): Promise<number> {
  const args = stripDryRunArgument(originalArgs);
  const dryRun = args.length < originalArgs.length;
  const options: FuryOptions = { dryRun };
  const services = customServices ?? getDefaultServices(options);

  if (shouldExecHelp(args)) {
    return execHelp();
  }
  if (shouldExecVersion(args)) {
    return execVersion();
  }
  if (shouldExecBranchDescription(args)) {
    return await execBranchDescription(args, services);
  }
  if (shouldExecListBranches(args)) {
    return await execListBranches(args, options, services);
  }
  return await execShorthandGitCommand(args, options, services);
}
