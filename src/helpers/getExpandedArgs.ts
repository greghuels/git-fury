import getCharToBranchMap, { CharToBranchMap } from './getCharToBranchMap.ts';

let _charToBranchMap: CharToBranchMap;
const getMemoizedCharToBranchMap = async (): Promise<CharToBranchMap> => {
  if (!_charToBranchMap) {
    _charToBranchMap = await getCharToBranchMap();
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

const expandAlphabeticArg = async (arg: string): Promise<string|null> => {
  if (/^[a-z]{1,2}$/.test(arg)) {
    const charToBranchMap = await getMemoizedCharToBranchMap();
    if (charToBranchMap[arg]) {
      return charToBranchMap[arg];
    }
  }
  return null;
};

const expandWithTildeOrCaret = async (arg: string, ch: '~' | '^'): Promise<string|null> => {
  const chIndex = arg.indexOf(ch);
  if (chIndex > -1) {
    const expanded = await expandAlphabeticArg(arg.slice(0, chIndex));
    if (expanded) {
      return `${expanded}${arg.slice(chIndex)}`;
    }
  }
  return null;
};

const expandArg = async (arg: string) =>
  expandNumericArg(arg)
    ?? await expandAlphabeticArg(arg)
    ?? await expandWithTildeOrCaret(arg, '^')
    ?? await expandWithTildeOrCaret(arg, '~')
    ?? arg;

const expandArgs = async (args: Array<string>) => {
  const expandedArgs: Array<string> = [];
  for (const arg of args) {
    expandedArgs.push(await expandArg(arg));
  }
  return expandedArgs;
}

export default async function getExpandedArgs(args: Array<string>): Promise<string[]> {
  try {
    const expandedArgs: Array<string> = [];
    for (const arg of args) {
      const trimmedArg = arg.trim();
      if (trimmedArg.includes(':')) {
        expandedArgs.push((await expandArgs(trimmedArg.split(':'))).join(':'));
      } else if (trimmedArg.includes('/')) {
        expandedArgs.push((await expandArgs(trimmedArg.split('/'))).join('/'));
      } else {
        expandedArgs.push(await expandArg(arg));
      }
    }
    return expandedArgs;
  } catch (e) {
    if (e && e.status) {
      Deno.exit(e.status);
    }
    throw e;
  }
}
