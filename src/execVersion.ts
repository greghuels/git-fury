import version from './version.ts';

export const shouldExecVersion = (args: Array<string>): boolean =>
  args[0] === '-v' || args[0] === '--version';

export default function execVersion(): number {
  console.log(`git-fury version ${version}`);
  return 0;
}
