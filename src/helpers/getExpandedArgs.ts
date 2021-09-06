const expandNumeric = (arg: string): string | null => {
  if (/^\d{1,3}$/.test(arg)) {
    const parsedArg = parseInt(arg, 10);
    return `HEAD~${parsedArg}`;
  }
  return null;
};

const expandAlphabetic = (
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
    const expanded = expandAlphabetic(
      arg.slice(0, chIndex),
      charToBranchMap,
    );
    if (expanded) {
      return `${expanded}${arg.slice(chIndex)}`;
    }
  }
  return null;
};

const expandClause = (
  clause: string,
  charToBranchMap: Record<string, string>,
) =>
  expandNumeric(clause) ??
    expandAlphabetic(clause, charToBranchMap) ??
    expandWithTildeOrCaret(clause, "^", charToBranchMap) ??
    expandWithTildeOrCaret(clause, "~", charToBranchMap) ??
    clause;

const expandArg = (
  arg: string,
  clauseSeparators: Array<string>,
  charToBranchMap: Record<string, string>,
): string => {
  const separators = [...clauseSeparators];
  const ch = separators.pop();
  if (ch) {
    return arg.split(ch).map((clause) =>
      expandArg(clause, separators, charToBranchMap)
    ).join(ch);
  } else {
    return expandClause(arg, charToBranchMap);
  }
};

export default function getExpandedArgs(
  args: Array<string>,
  charToBranchMap: Record<string, string>,
): string[] {
  const clauseSeparators = [":", "/", "..", "..."];
  return args.map((arg) =>
    expandArg(arg.trim(), clauseSeparators, charToBranchMap)
  );
}
