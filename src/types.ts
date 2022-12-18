import { BranchService } from "./services/BranchService.ts";
import { GitService } from "./services/GitService.ts";

export interface ServiceContainer {
  log: typeof console.log;
  gitService: GitService;
  branchService: BranchService;
}

export interface FuryOptions {
  dryRun: boolean;
}
