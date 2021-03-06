import { execSync } from 'child_process';

function getCharFromNum(num: number): string {
  const i = num - 1;
  if (num > 26) {
    const moreSignificantDigit = Math.floor(i / 26);
    const remainder = Math.floor(i % 26) + 1;
    return `${getCharFromNum(moreSignificantDigit)}${getCharFromNum(remainder)}`;
  } else {
    return String.fromCharCode(97 + i);
  }
}

export type CharToBranchMap = {
 [char: string]: string
}

export default function getCharToBranchMap(): CharToBranchMap {
  let num = 1;
  return execSync('git branch --format=\'%(refname:short)\'').toString().split('\n').reduce((acc, branch) => {
    if (branch) {
      acc[getCharFromNum(num)] = branch;
      num += 1;
    }
    return acc;
  }, {} as CharToBranchMap);
}
