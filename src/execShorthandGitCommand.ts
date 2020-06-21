import getExpandedArgs from './helpers/getExpandedArgs';
import executeGit, { ExecuteGitOptions } from './helpers/executeGit';
import listBranches from './helpers/listBranches';

export default async function execShorthandGitCommand(args: Array<string>, options: ExecuteGitOptions): Promise<number> {
  const expandedArgs = getExpandedArgs(args);
  const code = await executeGit(expandedArgs, options);
  if (!options.dryRun) {
    listBranches();
  }
  return code;
}

