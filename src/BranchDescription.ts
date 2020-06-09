import getCurrentBranch from './helpers/getCurrentBranch';
import { spawn } from 'child_process';
import listBranches from './helpers/listBranches';

export default class BranchDescription {

  private readonly branch: string;
  private readonly configSetting: string;

  constructor(branch?: string) {
    this.branch = branch?.trim() || getCurrentBranch();
    this.configSetting = `branch.${this.branch}.description`;
  }

  show(): Promise<number | undefined> {
    return new Promise((resolve) => {
      const child = spawn('git', ['config', this.configSetting], { stdio: 'inherit' });
      child.on('exit', (code) => {
        resolve(code);
      });
    });
  }

  set(description: string): Promise<number | undefined> {
    return new Promise((resolve) => {
      const child = spawn('git', ['config', this.configSetting, description], { stdio: 'inherit' });
      child.on('exit', (code) => {
        if (code) {
          resolve();
        } else {
          listBranches();
          resolve(code);
        }
      });
    });
  }

  remove(): Promise<number | undefined> {
    return new Promise((resolve) => {
      const child = spawn('git', ['config', '--unset', this.configSetting], { stdio: 'inherit' });
      child.on('exit', (code) => {
        if (code) {
          resolve();
        } else {
          listBranches();
          resolve(code);
        }
      });
    });
  }
}