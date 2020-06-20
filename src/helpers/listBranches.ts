import getBranchDescription from './getBranchDescription';
import getCharToBranchMap from './getCharToBranchMap';
import getCurrentBranch from './getCurrentBranch';
import Colorizer from './Colorizer';

export default function listBranches(): void {
  try {
    const currentBranch = getCurrentBranch();
    const charToBranchMap = getCharToBranchMap();
    Object.keys(charToBranchMap).forEach(ch => {
      const branch = charToBranchMap[ch];
      const desc = getBranchDescription(branch);
      if (branch === currentBranch) {
        const colorizer = new Colorizer();
        colorizer.normal('* ');
        colorizer.yellow(`(${ch})`);
        colorizer.green(` ${branch}`);
        colorizer.fadedNormal(` ${desc}`);
        colorizer.log();
      } else {
        const colorizer = new Colorizer();
        colorizer.yellow(`  (${ch})`);
        colorizer.normal(` ${branch}`);
        colorizer.fadedNormal(` ${desc}`);
        colorizer.log();
      }
    });
  } catch (e) {
    if (e && e.status) {
      process.exit(e.status);
    }
    throw e;
  }
}
