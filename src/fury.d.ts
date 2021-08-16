import BranchDescriptionService from "./services/BranchDescriptionService/BranchDescriptionService.ts";
import { BranchService } from "./services/BranchService/BranchService.ts";
import { GitService } from "./services/GitService/GitService.ts";

export interface ServiceContainer {
  log: typeof console.log;
  gitService: GitService;
  branchService: BranchService;
  branchDescriptionService: BranchDescriptionService;
}

export interface FuryOptions {
  dryRun: boolean;
}
