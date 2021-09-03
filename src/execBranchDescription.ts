import { ServiceContainer } from "./fury.d.ts";
import BranchRepository from "./repositories/BranchRepository.ts";

async function getBranchName(descArgs: Array<string>): Promise<string> {
  const filteredArgs = descArgs.filter((arg) => arg !== "-D" && arg !== "-S");
  const isDeleteOrShow = filteredArgs.length !== descArgs.length;
  if (isDeleteOrShow) {
    return filteredArgs[0] ?? (await BranchRepository.getCurrentBranch());
  } else {
    return filteredArgs.length < 2
      ? (await BranchRepository.getCurrentBranch())
      : filteredArgs[0];
  }
}

const outputHelp = () => {
  console.log("Usage:  desc [branch] <description|options>");
  console.log("Set, show or delete a branch description");
  console.log("");
  console.log("Options:");
  console.log(
    "  -D          Delete description for current or specified branch",
  );
  console.log("              branch / shorthand branch");
  console.log(
    "  -S          Show description for the current or specified branch",
  );
  console.log("              branch / shorthand branch");
  console.log("  -h, --help  display help for command");
};

export const shouldExecBranchDescription = (args: Array<string>): boolean =>
  args[0] === "desc";

export default async function execBranchDescription(
  originalArgs: Array<string>,
  services: ServiceContainer,
): Promise<number> {
  const { branchService, gitService, branchDescriptionService } = services;
  const charToBranchMap = await branchService.getCharToBranchMap();
  const expandedArgs = gitService.getExpandedArgs(
    originalArgs,
    charToBranchMap,
  );
  const descArgs = expandedArgs.slice(1);

  if (descArgs.length === 0 || descArgs.length > 2) {
    outputHelp();
    return 1;
  } else {
    const branchName = (await getBranchName(descArgs)).trim();
    let code: number;
    if (descArgs.includes("-D")) {
      code = await branchDescriptionService.removeBranchDescription(branchName);
    } else if (descArgs.includes("-S")) {
      code = await branchDescriptionService.showBranchDescription(branchName);
    } else {
      const descriptionString = descArgs.length === 2
        ? descArgs[1]
        : descArgs[0];
      code = await branchDescriptionService.setBranchDescription(
        branchName,
        descriptionString,
      );
    }
    return code;
  }
}
