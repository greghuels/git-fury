import chalk from 'chalk';
import { spawn } from 'child_process';
import { quote } from 'shell-quote';

export function printDryRun(args: Array<string>, options: ExecuteGitOptions): void {
  const text = quote(['git', ...args]);
  options.log(chalk.reset.dim(text));
}

export interface ExecuteGitOptions {
  dryRun: boolean;
  log: typeof console.log;
}

export default async function executeGit(expandedArgs: Array<string>, options: ExecuteGitOptions): Promise<number> {
  return new Promise((resolve) => {
    if (options.dryRun) {
      printDryRun(expandedArgs, options);
      resolve(0);
    } else {
      const child = spawn('git', [...expandedArgs], { stdio: 'inherit' });
      child.on('exit', (code) => {
        resolve(code);
      });
    }
  });
}