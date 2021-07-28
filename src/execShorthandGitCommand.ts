import getExpandedArgs from './helpers/getExpandedArgs.ts';
import executeGit, { ExecuteGitOptions } from './helpers/executeGit.ts';
import listBranches from './helpers/listBranches.ts';

export default async function execShorthandGitCommand(args: Array<string>, options: ExecuteGitOptions): Promise<number> {
  const expandedArgs = await getExpandedArgs(args);
  const code = await executeGit(expandedArgs, options);
  if (!options.dryRun) {
    await listBranches(options.log);
  }
  return code;
}
