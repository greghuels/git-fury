import execBranchDescription, { shouldExecBranchDescription } from './execBranchDescription';
import execHelp, { shouldExecHelp } from './execHelp';
import execListBranches, { shouldExecListBranches } from './execListBranches';
import execShorthandGitCommand from './execShorthandGitCommand';
import execVersion, { shouldExecVersion } from './execVersion';

const stripDryRunArgument = (originalArgs: Array<string>): Array<string> => {
  const args = [...originalArgs];
  const dryRunArgumentIndex = originalArgs.indexOf('--dry-run');
  if (dryRunArgumentIndex > -1) {
    args.splice(dryRunArgumentIndex, 1);
  }
  return args;
};

export type FuryFn = (originalArgs: Array<string>, customLog?: typeof console.log) => Promise<number>;

const fury: FuryFn = async (originalArgs, customLog?: typeof console.log) => {
  const log = customLog ?? console.log;
  const args = stripDryRunArgument(originalArgs);
  const dryRun = args.length < originalArgs.length;
  if (shouldExecHelp(args)) {
    return execHelp();
  }
  if (shouldExecVersion(args)) {
    return execVersion();
  }
  if (shouldExecBranchDescription(args)) {
    return await execBranchDescription(args, { log, dryRun });
  }
  if (shouldExecListBranches(args)) {
    return execListBranches(args, { log, dryRun });
  }
  return await execShorthandGitCommand(args, { log, dryRun });
};

export default fury;
