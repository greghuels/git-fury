import { BranchService } from "./services/BranchService/BranchService.ts";
import { GitService } from "./services/GitService/GitService.ts";

export interface ServiceContainer {
  log: typeof console.log;
  branchService: BranchService;
  gitService: GitService;
}

export interface FuryOptions {
  dryRun: boolean;
}
