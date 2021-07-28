import { printDryRun, ExecuteGitOptions } from './helpers/executeGit.ts';
import listBranches from './helpers/listBranches.ts';

export const shouldExecListBranches = (args: Array<string>): boolean => {
  if (args[0] === 'branch') {
    if (args.length === 1) {
      return true;
    }
    if (args.length === 2 && ['--list', '-l'].includes(args[1])) {
      return true;
    }
  }
  return false;
};

export default async function execListBranches(expandedArgs: Array<string>, options: ExecuteGitOptions): Promise<number> {
  if (options.dryRun) {
    printDryRun(expandedArgs, options);
  } else {
    await listBranches(options.log);
  }
  return 0;
}
