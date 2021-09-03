import { BranchService } from "../src/services/BranchService.ts";
import { GitService } from "../src/services/GitService.ts";
import BranchDescriptionService from "../src/services/BranchDescriptionService.ts";
import { FuryOptions } from "../src/fury.d.ts";
import { Subprocess } from "../src/helpers/Subprocess.ts";
import { mock } from "../mod_test.ts";

const { spy } = mock;

export default function testSetup(options: FuryOptions) {
  const log = spy();
  Subprocess.exec = () => Promise.resolve({ code: 0, output: "", error: "" });
  Subprocess.spawn = () => Promise.resolve(0);
  const gitService = new GitService(options, log);
  const branchService = new BranchService(log);
  const branchDescriptionService = new BranchDescriptionService(
    options,
    gitService,
    branchService,
  );
  return {
    gitService,
    branchService,
    branchDescriptionService,
    log,
  };
}
