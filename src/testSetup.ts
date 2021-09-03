import { BranchService } from "../src/services/BranchService.ts";
import { GitService } from "../src/services/GitService.ts";
import BranchDescriptionService from "../src/services/BranchDescriptionService.ts";
import { FuryOptions } from "../src/fury.d.ts";
import { Subprocess } from "../src/helpers/Subprocess.ts";

export default function testSetup(options: FuryOptions) {
  console.log = () => {};
  Subprocess.exec = () => Promise.resolve({ code: 0, output: "", error: "" });
  Subprocess.spawn = () => Promise.resolve(0);
  const gitService = new GitService(options);
  const branchService = new BranchService();
  const branchDescriptionService = new BranchDescriptionService(
    options,
    gitService,
    branchService,
  );
  return {
    gitService,
    branchService,
    branchDescriptionService,
  };
}
