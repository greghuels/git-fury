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
  const gitCommand = expandedArgs[0] ?? "";
  const commandsToListBranches = [
    "branch",
    "checkout",
    "switch",
  ];
  if (!options.dryRun && commandsToListBranches.includes(gitCommand)) {
    await branchService.listBranches();
  }
  return code;
}
