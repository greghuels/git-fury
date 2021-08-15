import getExpandedArgs from './helpers/getExpandedArgs.ts';
import executeGit from './helpers/executeGit.ts';
import { FuryOptions } from "./fury.d.ts";
import { ServiceContainer } from "./fury.d.ts";

export default async function execShorthandGitCommand(args: Array<string>, options: FuryOptions, services: ServiceContainer): Promise<number> {
  const { branchService } = services;
  const charToBranchMap = await branchService.getCharToBranchMap();
  const expandedArgs = getExpandedArgs(args, charToBranchMap);
  const code = await executeGit(expandedArgs, options, services);
  if (!options.dryRun) {
    const { branchService } = services;
    await branchService.listBranches();
  }
  return code;
}
