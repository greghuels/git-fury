import { spawn } from 'child_process';
import getExpandedArgs from './getExpandedArgs';

export default async function executeGit(args: Array<string>): Promise<number> {
  return new Promise((resolve) => {
    const expandedArgs = getExpandedArgs(args);
    const child = spawn('git', [...expandedArgs], { stdio: 'inherit' });
    child.on('exit', (code) => {
      resolve(code);
    });
  });
}