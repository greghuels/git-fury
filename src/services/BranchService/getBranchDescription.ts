import { exec } from '../../helpers/subprocess.ts'

export default async function getBranchDescription (branch: string): Promise<string> {
  try {
    const { code, output, error } = await exec('git', 'config', `branch.${branch}.description`);
    if (!code) {
      return output.trim();
    } else if (code === 1 && !error) {
      return '';
    } else {
      console.error(error);
      Deno.exit(code);
    }
  } catch (e) {
    console.error(e);
    Deno.exit(1);
  }
}
