import execBranchDescription, { shouldExecBranchDescription } from './execBranchDescription.ts';
import execHelp, { shouldExecHelp } from './execHelp.ts';
import execListBranches, { shouldExecListBranches } from './execListBranches.ts';
import execShorthandGitCommand from './execShorthandGitCommand.ts';
import execVersion, { shouldExecVersion } from './execVersion.ts';

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
    return await execListBranches(args, { log, dryRun });
  }
  return await execShorthandGitCommand(args, { log, dryRun });
}
