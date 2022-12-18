import { ServiceContainer } from "./types.ts";
import { _internals } from "./helpers/branchHelpers.ts";

async function getBranchName(descArgs: Array<string>): Promise<string> {
  const filteredArgs = descArgs.filter((arg) =>
    arg !== "-D" && arg !== "-S" && arg !== "-s"
  );
  const isDeleteOrShow = filteredArgs.length !== descArgs.length;
  if (isDeleteOrShow) {
    return filteredArgs[0] ?? (await _internals.getCurrentBranch());
  } else {
    return filteredArgs.length < 2
      ? (await _internals.getCurrentBranch())
      : filteredArgs[0];
  }
}

const outputHelp = (log: typeof console.log) => {
  log("Usage:  desc [branch] <description|options>");
  log("Set, show or delete a branch description");
  log("");
  log("Options:");
  log("  -D          Delete description for current or specified branch");
  log("              branch / shorthand branch");
  log("  -s          Show description for the current or specified branch");
  log("              branch / shorthand branch");
  log("  -h, --help  display help for command");
};

export const shouldExecBranchDescription = (args: Array<string>): boolean =>
  args[0] === "desc";

export default async function execBranchDescription(
  originalArgs: Array<string>,
  services: ServiceContainer,
): Promise<number> {
  const { branchService, gitService } = services;
  const charToBranchMap = await branchService.getCharToBranchMap();
  const expandedArgs = gitService.getExpandedArgs(
    originalArgs,
    charToBranchMap,
  );
  const descArgs = expandedArgs.slice(1);

  if (descArgs.length === 0 || descArgs.length > 2) {
    outputHelp(services.log);
    return 1;
  } else {
    const branchName = (await getBranchName(descArgs)).trim();
    let code: number;
    if (descArgs.includes("-D")) {
      code = await branchService.removeBranchDescription(branchName);
    } else if (descArgs.includes("-s") || descArgs.includes("-S")) {
      code = await branchService.showBranchDescription(branchName);
    } else {
      const descriptionString = originalArgs.slice(-1)[0];
      code = await branchService.setBranchDescription(
        branchName,
        descriptionString,
      );
    }
    return code;
  }
}
