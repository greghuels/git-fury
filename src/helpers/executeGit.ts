import { colors } from '../../deps.ts';
import { spawn } from './subprocess.ts'
import quote from './quote.ts';
import { FuryOptions, ServiceContainer } from "../fury.d.ts";

export function printDryRun(args: Array<string>, services: ServiceContainer): void {
  const text = quote(['git', ...args]);
  services.log(colors.reset(colors.dim(text)));
}

export default async function executeGit(expandedArgs: Array<string>, options: FuryOptions, services: ServiceContainer): Promise<number> {
  if (options.dryRun) {
    printDryRun(expandedArgs, services);
    return 0;
  } else {
    return await spawn('git', ...expandedArgs);
  }
}