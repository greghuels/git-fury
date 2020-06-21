const getVersion = (): string =>
  require('../package.json').version; // eslint-disable-line

export const shouldExecVersion = (args: Array<string>): boolean =>
  args[0] === '-v' || args[0] === '--version';

export default function execVersion(): number {
  console.log(`git-fury version ${getVersion()}`);
  return 0;
}
