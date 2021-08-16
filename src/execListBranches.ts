import { FuryOptions, ServiceContainer } from "./fury.d.ts";

export const shouldExecListBranches = (args: Array<string>): boolean => {
  if (args[0] === "branch") {
    if (args.length === 1) {
      return true;
    }
    if (args.length === 2 && ["--list", "-l"].includes(args[1])) {
      return true;
    }
  }
  return false;
};

export default async function execListBranches(
  expandedArgs: Array<string>,
  options: FuryOptions,
  services: ServiceContainer,
): Promise<number> {
  if (options.dryRun) {
    const { gitService } = services;
    gitService.printDryRun(expandedArgs);
  } else {
    const { branchService } = services;
    await branchService.listBranches();
  }
  return 0;
}
