import { execSync } from 'child_process';

export default function getBranchDescription (branch: string): string {
  try {
    return execSync(`git config branch.${branch}.description`).toString().trim();
  } catch (e) {
    return '';
  }
}
