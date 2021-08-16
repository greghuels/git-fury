import program from './program.ts';
import { ServiceContainer } from "./fury.d.ts";
import BranchRepository from "./repositories/BranchRepository.ts";

async function getBranchName(descArgs: Array<string>): Promise<string> {
  const filteredArgs = descArgs.filter(arg => arg !== '-D' && arg !== '-S');
  const isDeleteOrShow = filteredArgs.length !== descArgs.length;
  if (isDeleteOrShow) {
    return filteredArgs[0] ?? (await BranchRepository.getCurrentBranch());
  } else {
    return filteredArgs.length < 2 ? (await BranchRepository.getCurrentBranch()) : filteredArgs[0];
  }
}

export const shouldExecBranchDescription = (args: Array<string>): boolean =>
  args[0] === 'desc';

export default async function execBranchDescription(originalArgs: Array<string>, services: ServiceContainer): Promise<number> {
  const { branchService, gitService, branchDescriptionService } = services;
  const charToBranchMap = await branchService.getCharToBranchMap();
  const expandedArgs = gitService.getExpandedArgs(originalArgs, charToBranchMap);
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
    const branchName = (await getBranchName(descArgs)).trim();
    let code: number;
    if (descArgs.includes('-D')) {
      code = await branchDescriptionService.removeBranchDescription(branchName);
    } else if (descArgs.includes('-S')) {
      code = await branchDescriptionService.showBranchDescription(branchName);
    } else {
      const descriptionString = descArgs.length === 2 ? descArgs[1] : descArgs[0];
      code = await branchDescriptionService.setBranchDescription(branchName, descriptionString);
    }
    return code;
  }
}