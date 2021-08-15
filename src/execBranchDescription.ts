import program from './program.ts';
import BranchDescription from './BranchDescription.ts';
import getCurrentBranch from './helpers/getCurrentBranch.ts';
import getExpandedArgs from './helpers/getExpandedArgs.ts';
import { FuryOptions } from "./fury.d.ts";
import { ServiceContainer } from "./fury.d.ts";

async function getBranchName(descArgs: Array<string>): Promise<string> {
  const filteredArgs = descArgs.filter(arg => arg !== '-D' && arg !== '-S');
  const isDeleteOrShow = filteredArgs.length !== descArgs.length;
  if (isDeleteOrShow) {
    return filteredArgs[0] ?? (await getCurrentBranch());
  } else {
    return filteredArgs.length < 2 ? (await getCurrentBranch()) : filteredArgs[0];
  }
}

export const shouldExecBranchDescription = (args: Array<string>): boolean =>
  args[0] === 'desc';

export default async function execBranchDescription(originalArgs: Array<string>, options: FuryOptions, services: ServiceContainer): Promise<number> {
  const expandedArgs = await getExpandedArgs(originalArgs);
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
    const branchName = await getBranchName(descArgs);
    const branchDescription = new BranchDescription(branchName, options, services);
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