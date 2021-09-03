import BranchDescriptionService from "./services/BranchDescriptionService.ts";
import { BranchService } from "./services/BranchService.ts";
import { GitService } from "./services/GitService.ts";

export interface ServiceContainer {
  gitService: GitService;
  branchService: BranchService;
  branchDescriptionService: BranchDescriptionService;
}

export interface FuryOptions {
  dryRun: boolean;
}
