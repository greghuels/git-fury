import { printDryRun, ExecuteGitOptions } from './helpers/executeGit';
import listBranches from './helpers/listBranches';

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

export default function execListBranches(expandedArgs: Array<string>, options: ExecuteGitOptions): number {
  if (options.dryRun) {
    printDryRun(expandedArgs, options);
  } else {
    listBranches(options.log);
  }
  return 0;
}

