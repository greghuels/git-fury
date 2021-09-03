const expandNumericArg = (arg: string): string | null => {
  if (/^\d{1,3}$/.test(arg)) {
    const parsedArg = parseInt(arg, 10);
    return `HEAD~${parsedArg}`;
  }
  return null;
};

const expandAlphabeticArg = (
  arg: string,
  charToBranchMap: Record<string, string>,
): string | null => {
  if (/^[a-z]{1,2}$/.test(arg)) {
    if (charToBranchMap[arg]) {
      return charToBranchMap[arg];
    }
  }
  return null;
};

const expandWithTildeOrCaret = (
  arg: string,
  ch: "~" | "^",
  charToBranchMap: Record<string, string>,
): string | null => {
  const chIndex = arg.indexOf(ch);
  if (chIndex > -1) {
    const expanded = expandAlphabeticArg(
      arg.slice(0, chIndex),
      charToBranchMap,
    );
    if (expanded) {
      return `${expanded}${arg.slice(chIndex)}`;
    }
  }
  return null;
};

const expandArg = (arg: string, charToBranchMap: Record<string, string>) =>
  expandNumericArg(arg) ??
    expandAlphabeticArg(arg, charToBranchMap) ??
    expandWithTildeOrCaret(arg, "^", charToBranchMap) ??
    expandWithTildeOrCaret(arg, "~", charToBranchMap) ??
    arg;

const expandArgs = (
  args: Array<string>,
  charToBranchMap: Record<string, string>,
) => {
  const expandedArgs: Array<string> = [];
  for (const arg of args) {
    expandedArgs.push(expandArg(arg, charToBranchMap));
  }
  return expandedArgs;
};

export default function getExpandedArgs(
  args: Array<string>,
  charToBranchMap: Record<string, string>,
): string[] {
  const expandedArgs: Array<string> = [];
  for (const arg of args) {
    const trimmedArg = arg.trim();
    if (trimmedArg.includes(":")) {
      expandedArgs.push(
        (expandArgs(trimmedArg.split(":"), charToBranchMap)).join(":"),
      );
    } else if (trimmedArg.includes("/")) {
      expandedArgs.push(
        (expandArgs(trimmedArg.split("/"), charToBranchMap)).join("/"),
      );
    } else {
      expandedArgs.push(expandArg(arg, charToBranchMap));
    }
  }
  return expandedArgs;
}
