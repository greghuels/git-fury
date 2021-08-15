import { FuryOptions, ServiceContainer } from "./fury.d.ts";
import { printDryRun } from './helpers/executeGit.ts';

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

export default async function execListBranches(expandedArgs: Array<string>, options: FuryOptions, services: ServiceContainer): Promise<number> {
  if (options.dryRun) {
    printDryRun(expandedArgs, services);
  } else {
    const { branchService } = services;
    await branchService.listBranches();
  }
  return 0;
}
