import getExpandedArgs from './helpers/getExpandedArgs.ts';
import executeGit from './helpers/executeGit.ts';
import listBranches from './helpers/listBranches.ts';
import { FuryOptions } from "./fury.d.ts";
import { ServiceContainer } from "./fury.d.ts";

export default async function execShorthandGitCommand(args: Array<string>, options: FuryOptions, services: ServiceContainer): Promise<number> {
  const expandedArgs = await getExpandedArgs(args);
  const code = await executeGit(expandedArgs, options, services);
  if (!options.dryRun) {
    await listBranches(services.log);
  }
  return code;
}
