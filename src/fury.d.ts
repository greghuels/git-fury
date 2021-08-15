import { BranchService } from "./services/BranchService/BranchService.ts";

export interface ServiceContainer {
  log: typeof console.log;
  branchService: BranchService;
}

export interface FuryOptions {
  dryRun: boolean;
}
