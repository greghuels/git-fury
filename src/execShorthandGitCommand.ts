import { FuryOptions, ServiceContainer } from "./types.ts";

export default async function execShorthandGitCommand(
  args: Array<string>,
  options: FuryOptions,
  services: ServiceContainer,
): Promise<number> {
  const { branchService, gitService } = services;
  const charToBranchMap = await branchService.getCharToBranchMap();
  const expandedArgs = gitService.getExpandedArgs(args, charToBranchMap);
  const code = await gitService.executeGit(expandedArgs);
  if (!options.dryRun) {
    await branchService.listBranches();
  }
  return code;
}
