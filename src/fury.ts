import execBranchDescription, { shouldExecBranchDescription } from './execBranchDescription.ts';
import execHelp, { shouldExecHelp } from './execHelp.ts';
import execListBranches, { shouldExecListBranches } from './execListBranches.ts';
import execShorthandGitCommand from './execShorthandGitCommand.ts';
import execVersion, { shouldExecVersion } from './execVersion.ts';
import { ServiceContainer } from "./fury.d.ts";
import { FuryOptions } from "./fury.d.ts";
import BranchDescriptionService from "./services/BranchDescriptionService/BranchDescriptionService.ts";
import { BranchService } from "./services/BranchService/BranchService.ts";
import { GitService } from "./services/GitService/GitService.ts";

const stripDryRunArgument = (originalArgs: Array<string>): Array<string> => {
  const args = [...originalArgs];
  const dryRunArgumentIndex = originalArgs.indexOf('--dry-run');
  if (dryRunArgumentIndex > -1) {
    args.splice(dryRunArgumentIndex, 1);
  }
  return args;
};

const getDefaultServices = (options: FuryOptions): ServiceContainer => {
  const log = console.log;
  const gitService = new GitService(options, log);
  const branchService = new BranchService(log);
  const branchDescriptionService = new BranchDescriptionService(options, gitService, branchService);

  return { log, gitService, branchService, branchDescriptionService };
}


export default async function fury (originalArgs: Array<string>, customServices?: ServiceContainer): Promise<number> {
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
