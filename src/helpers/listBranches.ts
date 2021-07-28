import { colors } from '../../deps.ts';
import getBranchDescription from './getBranchDescription.ts';
import getCharToBranchMap from './getCharToBranchMap.ts';
import getCurrentBranch from './getCurrentBranch.ts';

async function getBranchListing(ch: string, branch: string, currentBranch: string): Promise<string> {
  const isCurrentBranch = branch === currentBranch;
  const desc = await getBranchDescription(branch); // TODO: Cache these
  const prefixText = isCurrentBranch ? '* ' : '  ';
  const branchColor = isCurrentBranch ? colors.green : colors.reset;
  return colors.reset(prefixText) + colors.yellow(`(${ch})`) + branchColor(` ${branch}`) + colors.reset(colors.dim(` ${desc}`));
}

export default async function listBranches(log: typeof console.log): Promise<void> {
  const currentBranch = await getCurrentBranch();
  const charToBranchMap = await getCharToBranchMap();
  for (const entry of Object.entries(charToBranchMap)) {
    const [ch, branch] = entry;
    log(await getBranchListing(ch, branch, currentBranch));
  }
}
