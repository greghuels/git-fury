import getCurrentBranch from './helpers/getCurrentBranch';
import { spawn } from 'child_process';

export default class BranchDescription {

  private readonly branch: string;

  constructor(branch?: string) {
    this.branch = branch?.trim() || getCurrentBranch();
  }

  set(description: string): Promise<number | undefined> {
    return new Promise((resolve) => {
      const configSetting = `branch.${this.branch}.description`;
      const child = spawn('git', ['config', '--global', configSetting, description], { stdio: 'inherit' });
      child.on('exit', (code) => {
        if (code) {
          resolve();
        } else {
          resolve(code);
        }
      });
    });
  }

  remove(): Promise<number | undefined> {
    return new Promise((resolve) => {
      const configSetting = `branch.${this.branch}.description`;
      const child = spawn('git', ['config', '--global', '--unset', configSetting], { stdio: 'inherit' });
      child.on('exit', (code) => {
        if (code) {
          resolve();
        } else {
          resolve(code);
        }
      });
    });
  }
}