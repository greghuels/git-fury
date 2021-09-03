import { Subprocess } from "../helpers/Subprocess.ts";

export default class BranchRepository {
  static getBranchDescription = async (branch: string): Promise<string> => {
    try {
      const { code, output, error } = await Subprocess.exec(
        "git",
        "config",
        `branch.${branch}.description`,
      );
      if (!code) {
        return output.trim();
      } else if (code === 1 && !error) {
        return "";
      } else {
        console.error(error);
        Deno.exit(code);
      }
    } catch (e) {
      console.error(e);
      Deno.exit(1);
    }
  };

  static getCurrentBranch = async (): Promise<string> => {
    try {
      const { code, output, error } = await Subprocess.exec(
        "git",
        "rev-parse",
        "--abbrev-ref",
        "HEAD",
      );
      if (!code) {
        const curBranch = output.trim();
        return curBranch === "HEAD" ? "" : curBranch;
      } else {
        console.error(error);
        Deno.exit(code);
      }
    } catch (e) {
      console.error(e);
      Deno.exit(1);
    }
  };

  static getAvailableBranches = async (): Promise<Array<string>> => {
    try {
      const { code, output, error } = await Subprocess.exec(
        "git",
        "branch",
        "--format=%(refname:short)",
      );
      if (!code) {
        const branches = output.split("\n");
        return branches;
      } else {
        console.error(error);
        Deno.exit(code);
      }
    } catch (e) {
      console.error(e);
      Deno.exit(1);
    }
  };
}
