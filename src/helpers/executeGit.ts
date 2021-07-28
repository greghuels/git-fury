import { colors } from '../../deps.ts';
import { spawn } from './subprocess.ts'
import quote from './quote.ts';

export function printDryRun(args: Array<string>, options: ExecuteGitOptions): void {
  const text = quote(['git', ...args]);
  options.log(colors.reset(colors.dim(text)));
}

export interface ExecuteGitOptions {
  dryRun: boolean;
  log: typeof console.log;
}

export default async function executeGit(expandedArgs: Array<string>, options: ExecuteGitOptions): Promise<number> {
  if (options.dryRun) {
    printDryRun(expandedArgs, options);
    return 0;
  } else {
    return await spawn('git', ...expandedArgs);
  }
}