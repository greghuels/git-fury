import { spawn } from 'child_process';
import chalk from 'chalk';

export function printDryRun(args: Array<string>): void {
  const text = ['git', ...args].join(' ');
  console.log(chalk.reset.dim(text));
}

export interface ExecuteGitOptions {
  dryRun?: boolean;
}

export default async function executeGit(expandedArgs: Array<string>, options: ExecuteGitOptions = {}): Promise<number> {
  return new Promise((resolve) => {
    if (options.dryRun) {
      printDryRun(expandedArgs);
      resolve(0);
    } else {
      const child = spawn('git', [...expandedArgs], { stdio: 'inherit' });
      child.on('exit', (code) => {
        resolve(code);
      });
    }
  });
}