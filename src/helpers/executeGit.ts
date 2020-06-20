import { spawn } from 'child_process';
import Colorizer from './Colorizer';

function dryRun(args: Array<string>): void {
  const text = ['git', ...args].join(' ');
  const colorizer = new Colorizer();
  colorizer.fadedNormal(text);
  colorizer.log();
}

export interface ExecuteGitOptions {
  dryRun?: boolean;
}

export default async function executeGit(expandedArgs: Array<string>, options: ExecuteGitOptions = {}): Promise<number> {
  return new Promise((resolve) => {
    if (options.dryRun) {
      dryRun(expandedArgs);
      resolve(0);
    } else {
      const child = spawn('git', [...expandedArgs], { stdio: 'inherit' });
      child.on('exit', (code) => {
        resolve(code);
      });
    }
  });
}