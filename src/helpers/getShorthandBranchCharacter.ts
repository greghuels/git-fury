export default function getShorthandBranchCharacter(index: number): string {
  if (index >= 26) {
    const moreSignificantDigit = Math.floor((index) / 26) - 1;
    const remainder = Math.floor(index % 26);
    return `${getShorthandBranchCharacter(moreSignificantDigit)}${
      getShorthandBranchCharacter(remainder)
    }`;
  } else {
    return String.fromCharCode(97 + index);
  }
}
