import execBranchDescription, { shouldExecBranchDescription } from './execBranchDescription.ts';
import execHelp, { shouldExecHelp } from './execHelp.ts';
import execListBranches, { shouldExecListBranches } from './execListBranches.ts';
import execShorthandGitCommand from './execShorthandGitCommand.ts';
import execVersion, { shouldExecVersion } from './execVersion.ts';
import { ServiceContainer } from "./fury.d.ts";
import { FuryOptions } from "./fury.d.ts";

const stripDryRunArgument = (originalArgs: Array<string>): Array<string> => {
  const args = [...originalArgs];
  const dryRunArgumentIndex = originalArgs.indexOf('--dry-run');
  if (dryRunArgumentIndex > -1) {
    args.splice(dryRunArgumentIndex, 1);
  }
  return args;
};


export default async function fury (originalArgs: Array<string>, customLog?: typeof console.log): Promise<number> {
  const log = customLog ?? console.log;
  const args = stripDryRunArgument(originalArgs);
  const dryRun = args.length < originalArgs.length;
  const options: FuryOptions = { dryRun };
  const services: ServiceContainer = { log };
  if (shouldExecHelp(args)) {
    return execHelp();
  }
  if (shouldExecVersion(args)) {
    return execVersion();
  }
  if (shouldExecBranchDescription(args)) {
    return await execBranchDescription(args, options, services);
  }
  if (shouldExecListBranches(args)) {
    return await execListBranches(args, options, services);
  }
  return await execShorthandGitCommand(args, options, services);
}
