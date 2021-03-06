import getCharToBranchMap, { CharToBranchMap } from './getCharToBranchMap';

let _charToBranchMap: CharToBranchMap;
const getMemoizedCharToBranchMap = (): CharToBranchMap => {
  if (!_charToBranchMap) {
    _charToBranchMap = getCharToBranchMap();
  }
  return _charToBranchMap;
};

const expandNumericArg = (arg: string): string | null => {
  if (/^\d{1,3}$/.test(arg)) {
    const parsedArg = parseInt(arg, 10);
    return `HEAD~${parsedArg}`;
  }
  return null;
};

const expandAlphabeticArg = (arg: string): string | null => {
  if (/^[a-z]{1,2}$/.test(arg)) {
    const charToBranchMap = getMemoizedCharToBranchMap();
    if (charToBranchMap[arg]) {
      return charToBranchMap[arg];
    }
  }
  return null;
};

const expandWithTildeOrCaret = (arg: string, ch: '~' | '^'): string | null => {
  const chIndex = arg.indexOf(ch);
  if (chIndex > -1) {
    const expanded = expandAlphabeticArg(arg.slice(0, chIndex));
    if (expanded) {
      return `${expanded}${arg.slice(chIndex)}`;
    }
  }
  return null;
};

const expandArg = (arg: string) =>
  expandNumericArg(arg)
    ?? expandAlphabeticArg(arg)
    ?? expandWithTildeOrCaret(arg, '~')
    ?? expandWithTildeOrCaret(arg, '^')
    ?? arg;

export default function getExpandedArgs(args: Array<string>): Array<string> {
  try {
    return args.map(arg => {
      const trimmedArg = arg.trim();
      if (trimmedArg.includes(':')) {
        return trimmedArg.split(':').map(expandArg).join(':');
      }
      if (trimmedArg.includes('/')) {
        return trimmedArg.split('/').map(expandArg).join('/');
      }
      return expandArg(trimmedArg);
    });
  } catch (e) {
    if (e && e.status) {
      process.exit(e.status);
    }
    throw e;
  }
}
