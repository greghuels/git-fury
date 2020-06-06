
import { execSync } from 'child_process';

export default function getCurrentBranch(): string {
  try {
    const curBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
    return curBranch === 'HEAD' ? '' : curBranch.trim();
  } catch (e) {
    return '';
  }
}