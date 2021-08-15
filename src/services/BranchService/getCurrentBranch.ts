
import { exec } from '../../helpers/subprocess.ts';

export default async function getCurrentBranch(): Promise<string> {
  const { code, output, error } = await exec('git', 'rev-parse', '--abbrev-ref', 'HEAD')
  if (!code) {
    const curBranch = output.trim();
    return curBranch === 'HEAD' ? '' : curBranch;
  } else {
    console.error(error);
    Deno.exit(code);
  }
}