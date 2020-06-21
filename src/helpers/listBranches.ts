import chalk from 'chalk';
import getBranchDescription from './getBranchDescription';
import getCharToBranchMap from './getCharToBranchMap';
import getCurrentBranch from './getCurrentBranch';

function getBranchListing(ch: string, branch: string, currentBranch: string): string {
  const isCurrentBranch = branch === currentBranch;
  const desc = getBranchDescription(branch);
  const prefixText = isCurrentBranch ? '* ' : '  ';
  const branchColor = isCurrentBranch ? chalk.green : chalk.reset;
  return chalk.reset(prefixText) + chalk.yellow(`(${ch})`) + branchColor(` ${branch}`) + chalk.reset.dim(` ${desc}`);
}

export default function listBranches(): void {
  const currentBranch = getCurrentBranch();
  const charToBranchMap = getCharToBranchMap();
  Object.entries(charToBranchMap).forEach(([ch, branch]) => {
    console.log(getBranchListing(ch, branch, currentBranch));
  });
}
