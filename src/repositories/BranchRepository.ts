import Subprocess from "../helpers/Subprocess.ts";

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
      /**
       * `git rev-parse --format=%(refname:short)` doesn't work when a tag exists with the same branch name.
       * `git symbolic-ref --short HEAD` doesn't work when a tag exists with the same branch name.
       * `git branch --show-current` only works for newer git versions and does not work when in a submodule.
       *  therefore,
       *  `git branch` and filtering results seems to be the only reliable way to get current branch spanning many git versions
       */
      const { code, output, error } = await Subprocess.exec(
        "git",
        "branch",
      );
      if (!code) {
        const currentBranchOutputLine = output.split("\n").filter((line) =>
          line.startsWith("*")
        );
        const currentBranch = currentBranchOutputLine.length
          ? currentBranchOutputLine[0].slice(1).trim()
          : "";
        return currentBranch === "HEAD" ? "" : currentBranch;
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
      );
      if (!code) {
        return output.split("\n").map((line) => {
          if (line.startsWith("*")) {
            line = line.slice(1);
          }
          return line.trim();
        });
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
