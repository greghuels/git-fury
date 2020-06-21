import { program } from 'commander';

import BranchDescription from './BranchDescription';
import getCurrentBranch from './helpers/getCurrentBranch';
import { ExecuteGitOptions } from './helpers/executeGit';
import getExpandedArgs from './helpers/getExpandedArgs';

function getBranchName(descArgs: Array<string>) {
  const filteredArgs = descArgs.filter(arg => arg !== '-D' && arg !== '-S');
  const isDeleteOrShow = filteredArgs.length !== descArgs.length;
  if (isDeleteOrShow) {
    return filteredArgs[0] ?? getCurrentBranch();
  } else {
    return filteredArgs.length < 2 ? getCurrentBranch() : filteredArgs[0];
  }
}

export const shouldExecBranchDescription = (args: Array<string>): boolean =>
  args[0] === 'desc';

export default async function execBranchDescription(originalArgs: Array<string>, options: ExecuteGitOptions): Promise<number> {
  const expandedArgs = getExpandedArgs(originalArgs);
  const descArgs = expandedArgs.slice(1);
  program
    .usage('desc [branch] <description|options>')
    .option('-D', 'Delete description for the current branch or optionally specified branch / shorthand branch')
    .option('-S', 'Show description for the current branch or optionally specified branch / shorthand branch')
    .description('Set, show or delete a branch description for the current branch or optionally specified branch / shorthand branch');

  if (descArgs.length === 0 || descArgs.length > 2) {
    program.outputHelp();
    return 1;
  } else {
    const branchName = getBranchName(descArgs);
    const branchDescription = new BranchDescription(branchName, options);
    let code: number;
    if (descArgs.includes('-D')) {
      code = await branchDescription.remove();
    } else if (descArgs.includes('-S')) {
      code = await branchDescription.show();
    } else {
      const descriptionString = descArgs.length === 2 ? descArgs[1] : descArgs[0];
      code = await branchDescription.set(descriptionString);
    }
    return code;
  }
}