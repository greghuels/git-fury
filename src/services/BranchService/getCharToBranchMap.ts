import { exec } from '../../helpers/subprocess.ts';

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

export default async function getCharToBranchMap(): Promise<CharToBranchMap> {
  let num = 1;
  const { code, output, error } = await exec('git', 'branch', '--format=%(refname:short)')
  if (!code) {
    const branches = output.split('\n');
    return branches.reduce((acc, branch) => {
      if (branch) {
        acc[getCharFromNum(num)] = branch;
        num += 1;
      }
      return acc;
    }, {} as CharToBranchMap);
  } else {
    console.error(error);
    Deno.exit(code);
  }
}
