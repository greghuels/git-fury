import { BranchService } from "./services/BranchService.ts";
import { GitService } from "./services/GitService.ts";
import { FuryOptions } from "./types.ts";
import Subprocess from "./helpers/Subprocess.ts";
import { mock } from "../dev_deps.ts";

const { spy } = mock;

export default function testSetup(options: FuryOptions) {
  const log = spy();
  Subprocess.exec = () => Promise.resolve({ code: 0, output: "", error: "" });
  Subprocess.spawn = () => Promise.resolve(0);
  const gitService = new GitService(options, log);
  const branchService = new BranchService(options, log, gitService);
  return {
    gitService,
    branchService,
    log,
  };
}
