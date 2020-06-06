import getCharToBranchMap, { CharToBranchMap } from './getCharToBranchMap';

let _charToBranchMap: CharToBranchMap;
const getMemoizedCharToBranchMap = (): CharToBranchMap => {
  if (!_charToBranchMap) {
    _charToBranchMap = getCharToBranchMap();
  }
  return _charToBranchMap;
};

export default function getExpandedArgs(
  args = process.argv.slice(2),
  { excludeNumArg = false, excludeCharArg = false } = {}
): Array<string> {
  try {
    return args.map(arg => {
      const trimmedArg = arg.trim();
      if (!excludeNumArg && /^\d+$/.test(trimmedArg)) {
        const parsedArg = parseInt(trimmedArg, 10);
        if (parsedArg < 1000) {
          return `HEAD~${parsedArg}`;
        }
      }
      if (!excludeCharArg && /^[a-z]{1,2}$/.test(trimmedArg)) {
        const charToBranchMap = getMemoizedCharToBranchMap();
        if (charToBranchMap[trimmedArg]) {
          return charToBranchMap[trimmedArg];
        }
      }
      return trimmedArg;
    });
  } catch (e) {
    if (e && e.status) {
      process.exit(e.status);
    }
    throw e;
  }
}
