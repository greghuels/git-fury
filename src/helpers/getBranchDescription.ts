import { execSync } from 'child_process';
import { quote } from 'shell-quote';

export default function getBranchDescription (branch: string): string {
  try {
    const cmd = quote(['git', 'config', `branch.${branch}.description`]);
    return execSync(cmd).toString().trim();
  } catch (e) {
    return '';
  }
}
